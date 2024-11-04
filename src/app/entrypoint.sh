if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

jq --args ip "$REDIRECT_URI" google_api_key "$GOOGLE_API_KEY" '.ip_address = $ip' /usr/src/app/assets/config.json > /usr/src/app/assets/config_temp.json && \
mv /usr/src/app/assets/config_temp.json /usr/src/app/assets/config.json
