


from django.http import JsonResponse
import requests
import tensorflow as tf
import numpy as np
from django.views.decorators.csrf import csrf_exempt
import cv2
from tensorflow.keras.models import load_model
import base64
from io import BytesIO
from PIL import Image
from tensorflow.keras.layers import Layer, Conv2D, Multiply, Concatenate
from tensorflow.keras.utils import register_keras_serializable


import os
import cv2
import torch
import numpy as np
from PIL import Image
from io import BytesIO
import base64
import requests
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from django.http import JsonResponse
from tensorflow.keras.models import load_model
import tensorflow as tf
from tensorflow.keras.utils import register_keras_serializable # Import register_keras_serializable

def dense_r2(y_true, y_pred):
    residual = tf.keras.backend.sum(tf.keras.backend.square(y_true - y_pred))
    total = tf.keras.backend.sum(tf.keras.backend.square(y_true - tf.keras.backend.mean(y_true)))
    r2 = 1 - residual / (total + tf.keras.backend.epsilon())
    return tf.convert_to_tensor(r2)


def mse(y_true, y_pred):
    return tf.keras.backend.mean(tf.keras.backend.square(y_pred - y_true))


def rmse(y_true, y_pred):
    return tf.keras.backend.sqrt(tf.keras.backend.mean(tf.keras.backend.square(y_pred - y_true)))


def dice_loss(y_true, y_pred):
    smooth = 1.0
    y_true_f = tf.keras.backend.flatten(y_true)
    y_pred_f = tf.keras.backend.flatten(y_pred)
    intersection = tf.keras.backend.sum(y_true_f * y_pred_f)
    return 1 - (2. * intersection + smooth) / (tf.keras.backend.sum(y_true_f) + tf.keras.backend.sum(y_pred_f) + smooth)


def bce_dice_loss(y_true, y_pred):
    bce = tf.keras.losses.BinaryCrossentropy()(y_true, y_pred)
    dice = dice_loss(y_true, y_pred)
    return bce + dice

# Channel Attention Block

def channel_attention(input_feature, ratio=8):
    channel = input_feature.shape[-1]
    avg_pool = tf.keras.layers.GlobalAveragePooling2D()(input_feature)
    avg_pool = tf.keras.layers.Dense(channel // ratio, activation='relu')(avg_pool)
    avg_pool = tf.keras.layers.Dense(channel, activation='sigmoid')(avg_pool)
    avg_pool = tf.keras.layers.Reshape((1, 1, channel))(avg_pool)
    return Multiply()([input_feature, avg_pool])

from tensorflow.keras.layers import Layer, Conv2D, Multiply, Concatenate
import tensorflow as tf

class SpatialAttention(Layer):
    def _init_(self, **kwargs):
        super(SpatialAttention, self)._init_(**kwargs)
        self.conv = Conv2D(1, kernel_size=7, padding='same', activation='sigmoid')

    def build(self, input_shape):
        # Explicitly call build on the Conv2D layer with appropriate input shape
        self.conv.build((input_shape[0], input_shape[1], input_shape[2], 2))
        super(SpatialAttention, self).build(input_shape)

    def call(self, inputs):
        # Compute the mean and max along the channel axis
        avg_pool = tf.reduce_mean(inputs, axis=-1, keepdims=True)
        max_pool = tf.reduce_max(inputs, axis=-1, keepdims=True)

        # Concatenate and apply convolution to get the attention map
        concat = Concatenate()([avg_pool, max_pool])
        spatial = self.conv(concat)

        # Multiply input by the spatial attention map
        return Multiply()([inputs, spatial])

    def compute_output_shape(self, input_shape):
        # The output shape is the same as the input shape
        return input_shape

    def get_config(self):
        config = super(SpatialAttention, self).get_config()
        return config

# Define custom objects dictionary for loading
custom_objects = {
    'dense_r2': dense_r2,
    'mse': mse,
    'rmse': rmse,
    'dice_loss': dice_loss,
    'bce_dice_loss': bce_dice_loss,
    'channel_attention': channel_attention,
    'SpatialAttention': SpatialAttention
}


model_path = os.path.join(os.path.dirname(__file__), '..', 'DAENET_RESNET101.keras')
# Loading the model with custom objects
model = tf.keras.models.load_model(model_path, custom_objects=custom_objects)

@csrf_exempt
def predict(request):
    if 'images' not in request.FILES:
        return JsonResponse({"error": "No images uploaded"}, status=400)

    results = []
    spatial_resolution = 10 * 10  # Area covered by each pixel (100 square units)

    for uploaded_image in request.FILES.getlist('images'):
        try:
            # Read and decode the image
            image_data = uploaded_image.read()
            image = np.frombuffer(image_data, np.uint8)
            image = cv2.imdecode(image, cv2.IMREAD_GRAYSCALE)

            if image is None:
                results.append({"error": "Failed to decode image"})
                continue

            # Preprocess image
            image = cv2.resize(image, (256, 256))  # Resized to model's expected input size
            image = image / 255.0  # Normalize
            image = np.expand_dims(image, axis=0)  # Add batch dimension
            image = np.expand_dims(image, axis=-1)  # Add channel dimension
            image = np.repeat(image, 3, axis=-1)  # Repeat channel to match model input

            # Run prediction
            y_pred = model.predict(image)
            threshold = 0.5
            binary_prediction = (y_pred > threshold).astype(np.uint8)
            oil_spill_detected = np.sum(binary_prediction) > 0

            # Calculate percentage and pixel count
            oil_spill_pixels = np.sum(binary_prediction) * spatial_resolution  # Adjusted for spatial resolution
            total_pixels = binary_prediction.size * spatial_resolution  # Adjusted for spatial resolution
            oil_spill_percentage = (oil_spill_pixels / total_pixels) * 100

            # Convert binary prediction mask to base64
            prediction_mask = (binary_prediction[0, :, :, 0] * 255).astype(np.uint8)  # Convert to grayscale
            mask_image = Image.fromarray(prediction_mask)
            buffered = BytesIO()
            mask_image.save(buffered, format="PNG")
            mask_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

            # Build result
            result = {
                "result": "Oil Spill Detected" if oil_spill_detected else "No Oil Spill Detected",
                "percentage": oil_spill_percentage,
                "oil_spill_pixels": int(oil_spill_pixels),  # Adjusted for spatial resolution
                "prediction_mask": mask_base64
            }
            results.append(result)

            # Send result to Node.js server
            try:
                requests.post("http://localhost:5000/result", json=result)
            except requests.RequestException as e:
                results.append({"error": f"Failed to send result to Node server: {str(e)}"})

        except Exception as e:
            results.append({"error": f"Error processing image: {str(e)}"})

    return JsonResponse({"results": results})
