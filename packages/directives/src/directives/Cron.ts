// #region ESLint Rules
/* eslint-disable @typescript-eslint/no-unsafe-assignment, class-methods-use-this */
// #endregion

// #region Developer Information
/*
 ********************************************
    Author: Xlantra1
    Email: Xlantra1@gmail.com

    Created At: 02-08-2021 12:40:26 PM
    Last Modified: 09-30-2022 11:12:26 AM
    Last Updated By: Andrew Laychak

    Description: Directive that handles the conversion of cron formats to different formats.

    References:
      - None
 ********************************************
*/
// #endregion

// #region Imports
import type { GraphQLSchema } from 'graphql';
import { GraphQLBoolean } from 'graphql';
import cronstrue from 'cronstrue';
import generateNewDirective from './Generate Directive.js';
// #endregion

// #region Cron Directive
/**
 * Directive that transforms the CRON result to a readable string, if required.
 *
 * @see {@link Apollo} for more information on Directives
 * @see {@link https://www.apollographql.com/docs/apollo-server/schema/creating-directives/}
 */
const CronDirective = (schema: GraphQLSchema) =>
  generateNewDirective(schema, {
    name: 'cron',
    args: [
      {
        keepCronFormat: {
          description: 'Transform the field to the specified type',
          type: GraphQLBoolean,
          defaultValue: false,
        },
      },
    ],
    resolveFn(result, otherArgs) {
      const { keepCronFormat } = otherArgs;

      if (keepCronFormat) {
        if (typeof result === 'string') {
          return result;
        }
      } else if (typeof result === 'string') {
        return cronstrue.toString(`0 ${result}`);
      }

      throw new Error('Cron Directive - Unknown format');
    },
  });
// #endregion

// #region Exports
export default CronDirective;
// #endregion
