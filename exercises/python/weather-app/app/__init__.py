from flask import Flask
from flasgger import Swagger

def create_app(config_object=None):
    """Application factory function."""
    app = Flask(__name__)
    
    # Load configuration if provided
    if config_object:
        app.config.from_object(config_object)

    # Initialize Swagger
    swagger_template = {
        "swagger": "2.0",
        "info": {
            "title": "Weather API",
            "description": "Flask weather API for Antigravity CLI training",
            "version": "1.0.0",
        },
    }
    swagger = Swagger(app, template=swagger_template)

    # Register Blueprints
    from app.routes.main import main_bp
    from app.routes.weather import weather_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(weather_bp)

    return app
