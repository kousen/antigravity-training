from flask import Flask
from flasgger import Swagger

def create_app(config_object=None):
    """Application factory function."""
    app = Flask(__name__)
    
    # Load configuration if provided
    if config_object:
        app.config.from_object(config_object)

    # Initialize Swagger
    swagger = Swagger(app)

    # Register Blueprints
    from app.routes.main import main_bp
    from app.routes.weather import weather_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(weather_bp)

    return app
