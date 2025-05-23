#!/bin/sh

# This script is used to run tests for the Kubo installer package.

# Run tests if the TEST environment variable is set
if [ "$RUN_TESTS" = "true" ]; then
    echo "Running tests..."
    yarn test
    if [ $? -ne 0 ]; then
        echo "Tests failed. Exiting."
        exit 1
    else
        echo "Tests passed."
    fi
else
    echo "Skipping tests. Set the TEST environment variable to 'true' to run tests."
fi

exec "$@"