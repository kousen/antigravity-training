from flask import Flask
from flasgger import Swagger
from flask_caching import Cache
from typing import Any, Optional

cache: Cache = Cache()

def create_app(config_object: Optional[Any] = None) -> Flask:
    """Application factory function."""
    app = Flask(__name__)
    
    # Initialize cache settings
    app.config.from_mapping({
        'CACHE_TYPE': 'SimpleCache',
        'CACHE_DEFAULT_TIMEOUT': 300
    })
    
    # Load default configuration
    app.config.from_object('app.config.Config')
    
    # Load configuration if provided
    if config_object:
        app.config.from_object(config_object)

    # Initialize Cache
    cache.init_app(app)

    # Initialize Swagger
    swagger = Swagger(app)

    # Register Blueprints
    from app.routes.main import main_bp
    from app.routes.weather import weather_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(weather_bp)

    # Register Error Handlers
    from app.routes.errors import register_error_handlers
    register_error_handlers(app)

    return app

