// #region ESLint Rules
/* eslint-disable @typescript-eslint/no-unsafe-assignment, class-methods-use-this */
// #endregion

// #region Developer Information
/*
 ********************************************
    Author: Xlantra1
    Email: Xlantra1@gmail.com

    Created At: 02-08-2021 12:40:07 PM
    Last Modified: 09-30-2022 10:11:16 AM
    Last Updated By: Andrew Laychak

    Description: 
        Append - This directive handles adding a text string to the end of the resulting value.

    References:
      - None
 ********************************************
*/
// #endregion

// #region Imports
import type { GraphQLSchema } from 'graphql';
import { GraphQLString } from 'graphql';
import generateNewDirective from './Generate Directive.js';
// #endregion

// #region Append Directive
/**
 * Directive that can be used to append information to a result (e.g. if the result is "Xlantra1" with an append of "- Developer", the final result is "Xlantra1 - Developer")
 *
 * @see {@link Apollo} for more information on Directives
 * @see {@link https://www.apollographql.com/docs/apollo-server/schema/creating-directives/}
 */
const AppendDirective = (schema: GraphQLSchema) =>
  generateNewDirective(schema, {
    name: 'append',
    args: [
      {
        append: {
          description: 'Appends a string to the end of a field',
          type: GraphQLString,
        },
      },
    ],
    resolveFn(result, otherArgs) {
      return (result as string) + otherArgs.append;
    },
  });
// #endregion

// #region Exports
export default AppendDirective;
// #endregion
