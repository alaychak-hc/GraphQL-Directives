// #region ESLint Rules
/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
// #endregion

// #region Developer Information
/*
 ********************************************
  Author: Andrew Laychak
  Email: ALaychak@harriscomputer.com
  
  Created At: 09-30-2022 09:36:32 AM
  Last Modified: 09-30-2022 02:24:52 PM
  Last Updated By: Andrew Laychak
  
  Description: Generates a new directive, using the supplied arguments.
  
  References:
    - None
 ********************************************
*/
// #endregion

// #region Imports
import { mapSchema, MapperKind } from '@graphql-tools/utils';
import type {
  DirectiveNode,
  GraphQLInputType,
  GraphQLSchema,
  InputValueDefinitionNode,
} from 'graphql';
import { defaultFieldResolver } from 'graphql';
import type { Maybe } from 'type-graphql';
import getDirective from './Get Directive.js';
// #endregion

// #region New Directive
interface NewDirectiveArgs {
  name: string;
  args: {
    [key: string]: {
      name?: string;
      description: string;
      type: GraphQLInputType;
      defaultValue?: boolean | number | string | [];
      extensions?: { [key: string]: unknown };
      astNode?: Maybe<InputValueDefinitionNode>;
      deprecationReason?: string;
    };
  }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolveFn: (result: any, otherArgs: { [key: string]: string }) => any;
}

/**
 * Generates a new directive, using the supplied arguments.
 *
 * @see {@link Apollo} for more information on Directives
 * @see {@link https://www.apollographql.com/docs/apollo-server/schema/creating-directives/}
 */
function generateNewDirective(
  schema: GraphQLSchema,
  data: NewDirectiveArgs
): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      if (!fieldConfig.astNode) {
        return fieldConfig;
      }

      const { directives } = fieldConfig.astNode;

      if (!directives) {
        return fieldConfig;
      }

      const { name, args, resolveFn } = data;

      const directive = getDirective(directives as DirectiveNode[], name);

      if (!directive) {
        return fieldConfig;
      }
      const { resolve = defaultFieldResolver } = fieldConfig;

      const uField = fieldConfig;

      if (!uField.args) {
        uField.args = {};
      }

      args.forEach((arg) => {
        uField.args = {
          ...uField.args,
          ...arg,
        };
      });
      // uField.args.dateFormat = {
      //   description: 'Transform the field to the specified type',
      //   type: GraphQLString,
      // };
      // uField.args.inFormat = {
      //   description: 'The date format the field is in',
      //   type: GraphQLString,
      // };
      uField.resolve = async (source, { ...otherArgs }, context, info) => {
        const result = await resolve(source, otherArgs, context, info);
        const returnValue = resolveFn(result, otherArgs);

        return returnValue;
      };

      return fieldConfig;
    },
  });
}
// #endregion

// #region Exports
export default generateNewDirective;
// #endregion
