# Langflow Telemetry System Documentation

## Overview

Langflow includes a telemetry system designed to collect usage analytics and performance metrics. This system has been modified to log telemetry data locally instead of sending it to external services, providing a foundation for future analytics integrations.

## Current Implementation Status

### Frontend Analytics (Disabled)
- **Location**: `src/frontend/src/customization/utils/analytics.ts`
- **Status**: All tracking functions are placeholder implementations that return immediately
- **Functions Available**:
  - `track(name, properties, id)` - General event tracking
  - `trackFlowBuild(flowName, isError, properties)` - Flow build tracking  
  - `trackDataLoaded(flowId, flowName, component, componentId)` - Data loading tracking

### Backend Telemetry (Active - Logging Only)
- **Location**: `src/backend/base/langflow/services/telemetry/`
- **Status**: Active logging system with placeholder for external service integration
- **Current Behavior**: Logs all telemetry data to application logs instead of sending to external services

## Data Collection

### Types of Data Collected

#### 1. Version Information (`VersionPayload`)
```json
{
  "package": "langflow",
  "version": "1.0.0",
  "platform": "Windows-10-10.0.19041-SP0",
  "python": "3.11",
  "arch": "64bit",
  "autoLogin": false,
  "cacheType": "InMemoryCache",
  "backendOnly": false,
  "desktop": false
}
```

#### 2. Flow Run Data (`RunPayload`)
```json
{
  "runIsWebhook": false,
  "runSeconds": 45,
  "runSuccess": true,
  "runErrorMessage": ""
}
```

#### 3. Playground Usage (`PlaygroundPayload`)
```json
{
  "playgroundSeconds": 120,
  "playgroundComponentCount": 5,
  "playgroundSuccess": true,
  "playgroundErrorMessage": ""
}
```

#### 4. Component Execution (`ComponentPayload`)
```json
{
  "componentName": "TextInput",
  "componentSeconds": 2,
  "componentSuccess": true,
  "componentErrorMessage": null
}
```

#### 5. Application Shutdown (`ShutdownPayload`)
```json
{
  "timeRunning": 3600
}
```

#### 6. OpenTelemetry Metrics
- **File Uploads**: Gauge tracking uploaded file sizes by flow_id
- **File Count**: Counter tracking number of files uploaded by flow_id
- **HTTP Metrics**: FastAPI instrumentation for request/response metrics
- **Custom Metrics**: Extensible system for application-specific metrics

## Telemetry Endpoints

The system logs data for the following logical endpoints:

- `/version` - Application version and environment information
- `/run` - Flow execution data
- `/playground` - Playground usage metrics
- `/component` - Individual component performance data
- `/shutdown` - Application shutdown timing

## Configuration

### Environment Variables
```bash
# Disable all telemetry
DO_NOT_TRACK=true

# Disable Prometheus metrics
PROMETHEUS_ENABLED=false
```

### Settings Configuration
```python
# In settings
do_not_track: bool = False  # Disable all telemetry
prometheus_enabled: bool = True  # Enable/disable Prometheus metrics
telemetry_base_url: str = "https://langflow.gateway.scarf.sh"  # Legacy - not used in current implementation
```

## Privacy Controls

### Complete Telemetry Disable
1. Set `DO_NOT_TRACK=true` environment variable
2. Set `do_not_track=true` in application settings
3. Either method will disable all telemetry collection

### Selective Disable
- Set `prometheus_enabled=false` to disable OpenTelemetry metrics while keeping basic logging

## Current Log Output Format

When telemetry is active, you'll see log entries like:

```
[INFO] [TELEMETRY] Endpoint: version
[INFO] [TELEMETRY] Payload: {"package": "langflow", "version": "1.0.0", ...}

[INFO] [TELEMETRY] Endpoint: run  
[INFO] [TELEMETRY] Payload: {"runSeconds": 45, "runSuccess": true, ...}

[INFO] [TELEMETRY] Endpoint: playground
[INFO] [TELEMETRY] Payload: {"playgroundSeconds": 120, "playgroundComponentCount": 5, ...}
```

## Future Integration Options

The current implementation provides a foundation for integrating with various analytics services:

### 1. Google Analytics 4
```python
# Example integration
async def send_to_google_analytics(payload_dict: dict, endpoint: str):
    # Configure GA4 Measurement Protocol
    measurement_id = "G-XXXXXXXXXX"
    api_secret = "your-api-secret"
    
    # Transform payload to GA4 events
    event_data = {
        "client_id": generate_client_id(),
        "events": [{
            "name": f"langflow_{endpoint}",
            "parameters": payload_dict
        }]
    }
    
    # Send to GA4
    await send_ga4_event(measurement_id, api_secret, event_data)
```

### 2. Mixpanel
```python
# Example integration
async def send_to_mixpanel(payload_dict: dict, endpoint: str):
    import mixpanel
    
    mp = mixpanel.Mixpanel("your-project-token")
    mp.track(user_id, f"langflow_{endpoint}", payload_dict)
```

### 3. Amplitude
```python
# Example integration
async def send_to_amplitude(payload_dict: dict, endpoint: str):
    import amplitude
    
    client = amplitude.Amplitude("your-api-key")
    event = amplitude.BaseEvent(
        event_type=f"langflow_{endpoint}",
        user_id=get_user_id(),
        event_properties=payload_dict
    )
    client.track(event)
```

### 4. Custom Analytics Endpoint
```python
# Example integration
async def send_to_custom_endpoint(payload_dict: dict, endpoint: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"https://your-analytics-api.com/{endpoint}",
            json=payload_dict,
            headers={"Authorization": "Bearer your-token"}
        )
```

### 5. Business Intelligence Platforms
```python
# Example integration with data warehouse
async def send_to_data_warehouse(payload_dict: dict, endpoint: str):
    # Send to Snowflake, BigQuery, Redshift, etc.
    import snowflake.connector
    
    conn = snowflake.connector.connect(
        user='your-user',
        password='your-password',
        account='your-account'
    )
    
    # Insert telemetry data into warehouse
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO telemetry_events (endpoint, payload, timestamp) VALUES (?, ?, ?)",
        (endpoint, json.dumps(payload_dict), datetime.now())
    )
```

## Implementation Guide

### Adding New Telemetry Events

1. **Define Payload Schema** (in `schema.py`):
```python
class CustomEventPayload(BaseModel):
    event_name: str = Field(serialization_alias="eventName")
    event_duration: int = Field(serialization_alias="eventDuration")
    event_success: bool = Field(serialization_alias="eventSuccess")
```

2. **Add Service Method** (in `service.py`):
```python
async def log_custom_event(self, payload: CustomEventPayload) -> None:
    await self._queue_event((self.send_telemetry_data, payload, "custom_event"))
```

3. **Call from Application Code**:
```python
from langflow.services.deps import get_telemetry_service

telemetry_service = get_telemetry_service()
payload = CustomEventPayload(
    event_name="custom_action",
    event_duration=30,
    event_success=True
)
await telemetry_service.log_custom_event(payload)
```

### Integrating External Analytics Service

1. **Modify `send_telemetry_data` method** in `service.py`:
```python
async def send_telemetry_data(self, payload: BaseModel, path: str | None = None) -> None:
    if self.do_not_track:
        logger.debug("Telemetry tracking is disabled.")
        return

    endpoint = path or "version"
    payload_dict = payload.model_dump(by_alias=True, exclude_none=True, exclude_unset=True)
    
    # Log locally (keep for debugging)
    logger.info(f"[TELEMETRY] Endpoint: {endpoint}")
    logger.info(f"[TELEMETRY] Payload: {payload_dict}")
    
    # Send to external service
    try:
        await self._send_to_analytics_service(payload_dict, endpoint)
        logger.debug("Telemetry data sent successfully.")
    except Exception as e:
        logger.error(f"Failed to send telemetry data: {e}")
```

2. **Add configuration for analytics service**:
```python
# In settings/base.py
analytics_service_enabled: bool = False
analytics_service_url: str = ""
analytics_service_token: str = ""
```

### OpenTelemetry Metrics Extension

Add custom metrics in `opentelemetry.py`:

```python
def _register_metric(self) -> None:
    # Existing metrics...
    
    # Add new custom metric
    self._add_metric(
        name="user_sessions",
        description="Active user sessions",
        unit="count",
        metric_type=MetricType.UP_DOWN_COUNTER,
        labels={"user_type": mandatory_label}
    )
```

## Security Considerations

1. **Data Sanitization**: Ensure no sensitive data (passwords, API keys, personal information) is included in telemetry payloads
2. **User Consent**: Respect user privacy preferences and provide clear opt-out mechanisms
3. **Data Retention**: Implement appropriate data retention policies for logged telemetry data
4. **Encryption**: Use HTTPS for external analytics service communications
5. **Access Control**: Restrict access to telemetry logs and analytics dashboards

## Testing

### Unit Tests
Tests are located in `tests/unit/test_telemetry.py` and cover:
- Telemetry service initialization
- Metric registration and validation
- Payload generation and logging
- Privacy controls (do-not-track)

### Integration Testing
```python
# Example test for telemetry logging
async def test_telemetry_logging():
    telemetry_service = TelemetryService(settings_service)
    
    with patch('langflow.services.telemetry.service.logger') as mock_logger:
        payload = RunPayload(run_seconds=30, run_success=True)
        await telemetry_service.log_package_run(payload)
        
        # Verify logging occurred
        mock_logger.info.assert_called_with("[TELEMETRY] Endpoint: run")
        mock_logger.info.assert_called_with("[TELEMETRY] Payload: {...}")
```

## Migration Notes

### From External Service to Logging
- **Before**: Telemetry data was sent to `https://langflow.gateway.scarf.sh`
- **After**: Telemetry data is logged locally with structured format
- **Impact**: No external network requests, all data stays local
- **Benefits**: Better privacy, easier debugging, foundation for custom analytics

### Backward Compatibility
- All existing telemetry collection points remain functional
- Payload schemas unchanged
- Configuration options preserved
- Privacy controls (DO_NOT_TRACK) still respected

## Troubleshooting

### Common Issues

1. **Telemetry Not Logging**:
   - Check if `DO_NOT_TRACK=true` is set
   - Verify `do_not_track` setting is `false`
   - Check log level configuration

2. **Missing Telemetry Data**:
   - Ensure telemetry service is started
   - Check for exceptions in telemetry worker
   - Verify queue processing is working

3. **Performance Impact**:
   - Telemetry uses async queuing to minimize performance impact
   - If needed, adjust queue size or processing frequency
   - Monitor memory usage for high-volume applications

### Debug Mode
Enable debug logging to see detailed telemetry processing:
```python
import logging
logging.getLogger("langflow.services.telemetry").setLevel(logging.DEBUG)
```

## Conclusion

The current telemetry system provides a solid foundation for analytics while respecting user privacy through local logging. The modular design makes it easy to integrate with external analytics services when needed, while maintaining the ability to completely disable telemetry collection.

For questions or contributions to the telemetry system, please refer to the main Langflow documentation and contribution guidelines.
