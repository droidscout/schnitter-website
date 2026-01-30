#!/bin/bash
set -e

# File to update
COMPOSE_FILE="docker-compose.yml"

if [ ! -f "$COMPOSE_FILE" ]; then
    echo "Error: $COMPOSE_FILE not found!"
    exit 1
fi

# Extract the current version (finds the first occurrence of image: droidscout/schnitter-*:X.Y.Z)
# We assume version is in format X.Y.Z
CURRENT_VERSION=$(grep -oE 'image: droidscout/schnitter-[a-z]+:[0-9]+\.[0-9]+\.[0-9]+' "$COMPOSE_FILE" | head -n 1 | awk -F: '{print $3}')

if [ -z "$CURRENT_VERSION" ]; then
    echo "Error: Could not find current version in $COMPOSE_FILE"
    exit 1
fi

echo "Current version: $CURRENT_VERSION"

# Split version into parts
IFS='.' read -r -a PARTS <<< "$CURRENT_VERSION"
MAJOR="${PARTS[0]}"
MINOR="${PARTS[1]}"
PATCH="${PARTS[2]}"

# Increment patch
NEW_PATCH=$((PATCH + 1))
NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"

echo "New version: $NEW_VERSION"

# Replace in file (works on both Mac and Linux sed)
# We replace explicitly the detected version tag with the new one for the specific image pattern
# Using perl for cross-platform regex support without -i extension issues
perl -i -pe "s/image: droidscout\/schnitter-([a-z]+):$CURRENT_VERSION/image: droidscout\/schnitter-\1:$NEW_VERSION/g" "$COMPOSE_FILE"

echo "Updated $COMPOSE_FILE with version $NEW_VERSION"

# Output for GitHub Actions
if [ -n "$GITHUB_ENV" ]; then
    echo "NEW_VERSION=$NEW_VERSION" >> "$GITHUB_ENV"
    echo "RELEASE_TAG=$NEW_VERSION" >> "$GITHUB_ENV"
fi
