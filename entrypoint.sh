#!/bin/sh

# Check if jq was able to process the file and update the values
if jq --arg ip "$FRONTEND_URI" --arg google_api_key "$GOOGLE_API_KEY" \
   '.ip_address = $ip | .google_api_key = $google_api_key' \
   /usr/src/app/src/assets/config.json > /usr/src/app/src/assets/config_temp.json; then
    mv /usr/src/app/src/assets/config_temp.json /usr/src/app/src/assets/config.json
    echo "Configuration file updated successfully."
else
    echo "Failed to update configuration file." >&2
    exit 1
fi

# Execute the CMD passed from the Dockerfile
exec "$@"
