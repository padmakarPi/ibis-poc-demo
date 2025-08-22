#!/bin/sh
OUTPUT_FILE="/app/public/env.json"
env_vars=$(printenv | grep '^NEXT' | awk -F= '{print $1}' | sort)
echo '{' > "$OUTPUT_FILE"
count=0
total=$(echo "$env_vars" | wc -l)
echo "$env_vars" | while read -r key; do
  value=$(printenv "$key" | sed 's/"/\\"/g')
  count=$((count + 1))
  if [ "$count" -lt "$total" ]; then
    echo "  \"$key\": \"$value\"," >> "$OUTPUT_FILE"
  else
    echo "  \"$key\": \"$value\"" >> "$OUTPUT_FILE"
  fi
done
echo '}' >> "$OUTPUT_FILE"