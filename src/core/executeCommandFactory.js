/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { isFunction } from "../utils";

export default ({ logger, configureCommand, logCommand, handleError }) => {
  let configurePromise;

  const getExecutor = (commandName, options) => {
    let execute;

    if (commandName === "configure") {
      if (configurePromise) {
        throw new Error(
          "The library has already been configured and may only be configured once."
        );
      }

      execute = () => {
        configurePromise = configureCommand(options);
        return configurePromise;
      };
    } else {
      if (!configurePromise) {
        throw new Error(
          `The library must be configured first. Please do so by executing the configure command.`
        );
      }

      if (commandName === "log") {
        execute = () => logCommand(options);
      } else {
        execute = () => {
          return configurePromise.then(
            componentRegistry => {
              const command = componentRegistry.getCommand(commandName);
              if (!isFunction(command)) {
                throw new Error(`The ${commandName} command does not exist.`);
              }
              return command(options);
            },
            () => {
              logger.warn(
                `An error during configuration is preventing the ${commandName} command from executing.`
              );
              // If configuration failed, we prevent the configuration
              // error from bubbling here because we don't want the
              // configuration error to be reported in the console every
              // time any command is executed. Only having it bubble
              // once when the configure command runs is sufficient.
              // Instead, for this command, we'll just return a promise
              // that never gets resolved.
              return new Promise(() => {});
            }
          );
        };
      }
    }

    return execute;
  };

  return (commandName, options = {}) => {
    return new Promise(resolve => {
      // We have to wrap the getExecutor() call in the promise so the promise
      // will be rejected if getExecutor() throws errors.
      const execute = getExecutor(commandName, options);
      logger.log(`Executing ${commandName} command.`, "Options:", options);
      resolve(execute());
    }).catch(handleError);
  };
};
