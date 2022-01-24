// #region ESLint Rules
/* eslint-disable @typescript-eslint/no-unsafe-assignment, class-methods-use-this */
// #endregion

// #region Developer Information
/*
 ********************************************
    Author: Andrew Laychak
    Email: ALaychak@harriscomputer.com

    Created At: 01-24-2022 03:10:28 PM
    Last Modified: 01-24-2022 03:10:33 PM
    Last Updated By: Andrew Laychak

    Description: Directive that handles the conversion of dates to specific formats.

    References:
      - None
 ********************************************
*/
// #endregion

// #region Imports
import { mapSchema, MapperKind } from '@graphql-tools/utils';
import { format, parse, parseISO } from 'date-fns';
import {
  defaultFieldResolver,
  DirectiveNode,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import getDirective from './Get Directive';
// #endregion

// #region Date Directive
/**
 * Directive that can be used to convert the result into a date format/style (e.g. 05/25/2021 => 25/05/2021 or May 25th, 2021)
 *
 * @see {@link Apollo} for more information on Directives
 * @see {@link https://www.apollographql.com/docs/apollo-server/schema/creating-directives/}
 */
const DateDirective = (schema: GraphQLSchema) =>
  mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      if (!fieldConfig.astNode) {
        return fieldConfig;
      }

      const { directives } = fieldConfig.astNode;

      if (!directives) {
        return fieldConfig;
      }

      const directive = getDirective(directives as DirectiveNode[], 'date');

      if (!directive) return fieldConfig;
      const { resolve = defaultFieldResolver } = fieldConfig;

      const uField = fieldConfig;

      if (!uField.args) {
        uField.args = {};
      }

      uField.args.dateFormat = {
        description: 'Transform the field to the specified type',
        type: GraphQLString,
      };

      uField.args.inFormat = {
        description: 'The date format the field is in',
        type: GraphQLString,
      };

      uField.resolve = async (source, { ...otherArgs }, context, info) => {
        const { dateFormat, inFormat }: { [key: string]: string } = otherArgs;
        let result = await resolve(source, otherArgs, context, info);
        let rValue: string = result;

        if (result && dateFormat) {
          if (typeof result === 'string') {
            result = parseISO(result);

            if (inFormat) {
              result = parse(result as string, inFormat, new Date());
            }
          }
          rValue = format(result as Date, dateFormat);
        }

        return rValue;
      };
      return fieldConfig;
    },
  });
// #endregion

// #region Exports
export default DateDirective;
// #endregion
