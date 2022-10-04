// #region ESLint Rules
/* eslint-disable @typescript-eslint/no-unsafe-assignment, class-methods-use-this */
// #endregion

// #region Developer Information
/*
 ********************************************
    Author: Andrew Laychak
    Email: ALaychak@harriscomputer.com

    Created At: 01-06-2022 02:34:02 PM
    Last Modified: 09-30-2022 12:15:48 PM
    Last Updated By: Andrew Laychak

    Description: Directive that handles the conversion of dates to specific formats.

    References:
      - None
 ********************************************
*/
// #endregion

// #region Imports
import { format, parse, parseISO } from 'date-fns';
import type { GraphQLSchema } from 'graphql';
import { GraphQLString } from 'graphql';
import generateNewDirective from './Generate Directive.js';
// #endregion

// #region Date Directive
/**
 * Directive that can be used to convert the result into a date format/style (e.g. 05/25/2021 => 25/05/2021 or May 25th, 2021)
 *
 * @see {@link Apollo} for more information on Directives
 * @see {@link https://www.apollographql.com/docs/apollo-server/schema/creating-directives/}
 */
const DateDirective = (schema: GraphQLSchema) =>
  generateNewDirective(schema, {
    name: 'date',
    args: [
      {
        dateFormat: {
          description: 'Transform the field to the specified type',
          type: GraphQLString,
        },
      },
      {
        inFormat: {
          description: 'The date format the field is in',
          type: GraphQLString,
        },
      },
    ],
    resolveFn(result, otherArgs) {
      const { dateFormat, inFormat } = otherArgs;

      let rValue: string = result;
      if (dateFormat) {
        if (typeof result === 'string') {
          let tempResult = parseISO(result);

          if (inFormat) {
            tempResult = parse(result, inFormat, new Date());
          }

          rValue = format(tempResult, dateFormat);
        } else {
          rValue = format(result as Date, dateFormat);
        }
      }

      return rValue;
    },
  });
// #endregion

// #region Exports
export default DateDirective;
// #endregion
