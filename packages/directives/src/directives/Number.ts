// #region ESLint Rules
/* eslint-disable @typescript-eslint/no-unsafe-assignment, class-methods-use-this */
// #endregion

// #region Developer Information
/*
 ********************************************
    Author: Andrew Laychak
    Email: ALaychak@harriscomputer.com

    Created At: 02-08-2021 12:41:18 PM
    Last Modified: 09-30-2022 04:08:13 PM
    Last Updated By: Andrew Laychak

    Description: Directive that handles unit conversions

    References:
      - Directives => https://github.com/Saeris/graphql-directives#formatdate
      - Numberal.js => https://github.com/adamwdraper/Numeral-js
 ********************************************
*/
// #endregion

// #region Imports
import type { GraphQLSchema } from 'graphql';
import { GraphQLString } from 'graphql';
import type { Numeral } from 'numeral';
import numeral from 'numeral';
import generateNewDirective from './Generate Directive.js';
// #endregion

// #region Number Directive
/**
 * Directive that can be used to convert the result into various specialized number styles. Also includes the ability to convert nulls/zeros into a string value (e.g. null => N/A)
 *
 * @see {@link Apollo} for more information on Directives
 * @see {@link https://www.apollographql.com/docs/apollo-server/schema/creating-directives/}
 */
// const NumberDirective = (schema: GraphQLSchema) =>
//   mapSchema(schema, {
//     [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
//       if (!fieldConfig.astNode) {
//         return fieldConfig;
//       }

//       const { directives } = fieldConfig.astNode;

//       if (!directives) {
//         return fieldConfig;
//       }

//       const directive = getDirective(directives as DirectiveNode[], 'number');

//       if (!directive) return fieldConfig;
//       const { resolve = defaultFieldResolver } = fieldConfig;

//       const uField = fieldConfig;

//       if (!uField.args) {
//         uField.args = {};
//       }

//       uField.args.nullFormat = {
//         description: 'Specifies the format for null values',
//         type: GraphQLString,
//       };

//       uField.args.zeroFormat = {
//         description: 'Specifies the format for zero values',
//         type: GraphQLString,
//       };

//       uField.args.numberFormat = {
//         description: 'Converts the number to the specified format',
//         type: GraphQLString,
//       };

//       uField.resolve = async (
//         source,
//         { nullFormat, zeroFormat, numberFormat, ...otherArgs },
//         context,
//         info
//       ) => {
//         const result: string = await resolve?.call(
//           this,
//           source,
//           otherArgs,
//           context,
//           info
//         );
//         let fResult = null;
//         let nResult = result;
//         if (!result) {
//           nResult = '';
//         }

//         logManager.info('RESULT: ', result);

//         numeral.reset();
//         const rValue: Numeral = numeral(nResult);

//         if (nullFormat) {
//           numeral.nullFormat(nullFormat as string);
//         }

//         if (zeroFormat) {
//           numeral.zeroFormat(zeroFormat as string);
//         }

//         if (numberFormat) {
//           fResult = rValue.format(numberFormat as string);
//         }

//         // if (!nullFormat && !zeroFormat) {
//         //   return result;
//         // }

//         if (fResult) {
//           return fResult;
//         }

//         return rValue.format();
//       };
//       return fieldConfig;
//     },
//   });

const NumberDirective = (schema: GraphQLSchema) =>
  generateNewDirective(schema, {
    name: 'number',
    args: [
      {
        nullFormat: {
          description: 'Specifies the format for null values',
          type: GraphQLString,
        },
      },
      {
        zeroFormat: {
          description: 'Specifies the format for zero values',
          type: GraphQLString,
        },
      },
      {
        numberFormat: {
          description: 'Converts the number to the specified format',
          type: GraphQLString,
        },
      },
    ],
    resolveFn(result, otherArgs) {
      const { nullFormat, zeroFormat, numberFormat } = otherArgs;

      let fResult;
      let nResult = result;
      if (!result) {
        nResult = '';
      }

      numeral.reset();
      const rValue: Numeral = numeral(nResult);

      if (nullFormat) {
        numeral.nullFormat(nullFormat);
      }

      if (zeroFormat) {
        numeral.zeroFormat(zeroFormat);
      }

      if (numberFormat) {
        fResult = rValue.format(numberFormat);
      }

      if (fResult !== null) {
        return fResult;
      }

      return rValue.format();
    },
  });
// #endregion

// #region Exports
export default NumberDirective;
// #endregion
