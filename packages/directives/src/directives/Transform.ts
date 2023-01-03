// #region ESLint Rules
/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
// #endregion

// #region Developer Information
/*
 ********************************************
    Author: Xlantra1
    Email: Xlantra1@gmail.com

    Created At: 02-08-2021 12:41:49 PM
    Last Modified: 01-03-2023 03:58:32 PM
    Last Updated By: Andrew Laychak

    Description: Directive that handles transforming strings to specified formats (e.g. lowercase)

    References:
      - Directives => https://github.com/Saeris/graphql-directives#formatdate
 ********************************************
*/
// #endregion

// #region Imports
import type { GraphQLSchema } from 'graphql';
import { GraphQLList, GraphQLInt, GraphQLString } from 'graphql';
import _ from 'lodash';
import generateNewDirective from './Generate Directive.js';
// #endregion

// #region Transform Directive
/**
 * Directive that can be used to transform the result to various formats including: UPPERCASE, LOWERCASE, CAMEL, CAPITALIZE, DEBUFF, KEBABCASE, SNAKECASE, HTML ESCAPE, HTML UNESCAPE, TRIM, and TRUNCATE
 *
 * @see {@link Apollo} for more information on Directives
 * @see {@link https://www.apollographql.com/docs/apollo-server/schema/creating-directives/}
 */
const TransformDirective = (schema: GraphQLSchema) =>
  generateNewDirective(schema, {
    name: 'transform',
    args: [
      {
        transform: {
          description: 'Formats the currency to the specified format',
          type: new GraphQLList(GraphQLString),
          defaultValue: [],
        },
      },
      {
        truncate: {
          description: 'Truncates the field at specific length',
          type: GraphQLInt,
          defaultValue: 30,
        },
      },
    ],
    resolveFn(result, otherArgs) {
      const { transform: transforms, truncate: truncateLength } = otherArgs;

      const tErrors: string[] = [];
      let fResult: string = result;
      // eslint-disable-next-line no-restricted-syntax
      for (const transform of transforms) {
        switch (transform.toUpperCase().trim()) {
          case 'UPPER':
            fResult = _.upperCase(fResult);
            break;
          case 'UPPERFIRST':
            fResult = _.upperFirst(fResult);
            break;
          case 'LOWER':
            fResult = _.lowerCase(fResult);
            break;
          case 'LOWERFIRST':
            fResult = _.lowerFirst(fResult);
            break;
          case 'CAMEL':
            fResult = _.camelCase(fResult);
            break;
          case 'CAPITALIZE':
            fResult = _.capitalize(fResult);
            break;
          case 'DEBURR':
            fResult = _.deburr(fResult);
            break;
          case 'KEBAB':
            fResult = _.kebabCase(fResult);
            break;
          case 'SNAKE':
            fResult = _.snakeCase(fResult);
            break;
          case 'ESCAPE':
            fResult = _.escape(fResult);
            break;
          case 'UNESCAPE':
            fResult = _.unescape(fResult);
            break;
          case 'TRIM':
            fResult = _.trim(fResult);
            break;
          case 'TRUNCATE': {
            fResult = _.truncate(fResult, {
              length: Number(truncateLength),
            });
            break;
          }
          default:
            tErrors.push(transform);
            break;
        }
      }

      if (tErrors.length > 0) {
        throw new Error(`INVALID TRANSFORM: [${tErrors.join(', ')}]`);
      }

      return fResult;
    },
  });
// #endregion

// #region Exports
export default TransformDirective;
// #endregion
