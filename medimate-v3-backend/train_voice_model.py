import pandas as pd
import numpy as np
import os
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings('ignore')

# Define the feature names from the dataset
FEATURE_NAMES = [
    'meanF0', 'stdevF0', 'meanIntensity', 'stdevIntensity', 'HNR',
    'localJitter', 'localabsoluteJitter', 'rapJitter', 'ppq5Jitter',
    'localShimmer', 'localdbShimmer', 'apq3Shimmer', 'aqpq5Shimmer', 'apq11Shimmer'
]

# Define the output directory for models
MODEL_DIR = 'models'
os.makedirs(MODEL_DIR, exist_ok=True)

def load_data(csv_path):
    """Load training data from CSV file."""
    print(f"Loading data from {csv_path}...")
    try:
        df = pd.read_csv(csv_path)
        print(f"Data loaded successfully. Shape: {df.shape}")
        return df
    except Exception as e:
        print(f"Error loading data: {e}")
        raise

def create_model():
    """Create a TensorFlow/Keras model matching the architecture in voice_analyzer.py"""
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(64, activation='relu', input_shape=(14,)),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(32, activation='relu'),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(1)  # Output layer for glucose level prediction
    ])
    
    model.compile(optimizer='adam',
                 loss='mse',
                 metrics=['mae'])
    
    return model

def train_model(df, model_filename='voice_glucose_model.keras'):
    """Train a Keras model on the provided data and save it."""
    print("Preparing data for training...")
    
    # Extract features and target
    X = df[FEATURE_NAMES].values
    y = df['glucose_level'].values
    
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print(f"Training data shape: {X_train.shape}")
    print(f"Test data shape: {X_test.shape}")
    
    # Create and train a Keras model
    print("Creating and training Keras model...")
    model = create_model()
    
    # Add early stopping to prevent overfitting
    early_stopping = tf.keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=10,
        restore_best_weights=True
    )
    
    # Train the model
    history = model.fit(
        X_train, y_train,
        epochs=50,
        batch_size=8,
        validation_split=0.2,
        callbacks=[early_stopping],
        verbose=1
    )
    
    # Evaluate the model
    print("Evaluating model...")
    train_predictions = model.predict(X_train, verbose=0).flatten()
    test_predictions = model.predict(X_test, verbose=0).flatten()
    
    # Calculate metrics
    train_rmse = np.sqrt(mean_squared_error(y_train, train_predictions))
    test_rmse = np.sqrt(mean_squared_error(y_test, test_predictions))
    train_mae = mean_absolute_error(y_train, train_predictions)
    test_mae = mean_absolute_error(y_test, test_predictions)
    train_r2 = r2_score(y_train, train_predictions)
    test_r2 = r2_score(y_test, test_predictions)
    
    print(f"Training RMSE: {train_rmse:.2f}")
    print(f"Test RMSE: {test_rmse:.2f}")
    print(f"Training MAE: {train_mae:.2f}")
    print(f"Test MAE: {test_mae:.2f}")
    print(f"Training R²: {train_r2:.2f}")
    print(f"Test R²: {test_r2:.2f}")
    
    # Plot training history
    plt.figure(figsize=(12, 4))
    
    plt.subplot(1, 2, 1)
    plt.plot(history.history['loss'], label='Training Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title('Training and Validation Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    
    plt.subplot(1, 2, 2)
    plt.plot(history.history['mae'], label='Training MAE')
    plt.plot(history.history['val_mae'], label='Validation MAE')
    plt.title('Training and Validation MAE')
    plt.xlabel('Epoch')
    plt.ylabel('MAE')
    plt.legend()
    
    plt.tight_layout()
    
    # Save the training history plot
    history_plot_path = os.path.join(MODEL_DIR, 'training_history.png')
    plt.savefig(history_plot_path)
    print(f"Training history plot saved to {history_plot_path}")
    
    # Save the model
    model_path = os.path.join(MODEL_DIR, model_filename)
    model.save(model_path)
    print(f"Model saved to {model_path}")
    
    # Create a visualization of predictions vs actual
    plt.figure(figsize=(10, 6))
    plt.scatter(y_test, test_predictions, alpha=0.6)
    plt.plot([y.min(), y.max()], [y.min(), y.max()], 'k--', lw=2)
    plt.xlabel('Actual Glucose Level')
    plt.ylabel('Predicted Glucose Level')
    plt.title('Actual vs Predicted Glucose Levels')
    plt.grid(True)
    
    # Save the plot
    plot_path = os.path.join(MODEL_DIR, 'prediction_plot.png')
    plt.savefig(plot_path)
    print(f"Prediction plot saved to {plot_path}")
    
    return model, test_rmse, test_r2

def check_model_on_high_ranges(df, model):
    """Check model performance specifically on higher glucose ranges (85+)."""
    print("\nEvaluating model performance on high normal glucose range (85+)...")
    
    # Filter data for glucose levels >= 85
    high_range_df = df[df['glucose_level'] >= 85]
    X_high = high_range_df[FEATURE_NAMES].values
    y_high = high_range_df['glucose_level'].values
    
    # Make predictions
    predictions = model.predict(X_high, verbose=0).flatten()
    
    # Calculate metrics
    rmse = np.sqrt(mean_squared_error(y_high, predictions))
    mae = mean_absolute_error(y_high, predictions)
    r2 = r2_score(y_high, predictions)
    
    print(f"Number of samples in high range: {len(y_high)}")
    print(f"High range RMSE: {rmse:.2f}")
    print(f"High range MAE: {mae:.2f}")
    print(f"High range R²: {r2:.2f}")

def main():
    """Main function to run the training pipeline."""
    csv_path = 'mock_training_data.csv'
    
    # Load data
    df = load_data(csv_path)
    
    # Train model
    model, rmse, r2 = train_model(df)
    
    # Check model on high glucose ranges
    check_model_on_high_ranges(df, model)
    
    print("\nModel training complete!")
    print(f"Overall test RMSE: {rmse:.2f}")
    print(f"Overall test R²: {r2:.2f}")
    print(f"Model saved to {os.path.join(MODEL_DIR, 'voice_glucose_model.keras')}")
    
    # Save evaluation metrics to a file
    with open(os.path.join(MODEL_DIR, 'model_performance.txt'), 'w') as f:
        f.write(f"Test RMSE: {rmse:.2f}\n")
        f.write(f"Test R²: {r2:.2f}\n")
        f.write(f"Date trained: {pd.Timestamp.now()}\n")
        f.write(f"Training data: {csv_path}\n")
        f.write(f"Number of samples: {len(df)}\n")
    
    return model

if __name__ == "__main__":
    print("Starting voice model training process...")
    main()
    print("Training process completed successfully.") 