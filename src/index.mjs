import {
  GraphQLSchema,
  GraphQLObjectType,
  Source,
  parse,
  validate,
  specifiedRules,
  execute,
} from 'graphql';

export { default as GraphQLLongType } from './types/GraphQLLongType.mjs';
export { default as getArgs } from './getArgs.mjs';

const generateApis = (apis, typeName, logger) => Object.keys(apis)
  .reduce((acc, name) => ({
    ...acc,
    [name]: {
      ...apis[name],
      async resolve(root, args, ctx) {
        const apiName = `graphql.${typeName}.${name}`;
        try {
          const ret = await apis[name].resolve(root, args, ctx);
          if (logger && logger.info) {
            logger.info(`${apiName}, ${JSON.stringify(args)}`);
          }
          return ret;
        } catch (error) {
          if (logger && logger.warn) {
            logger.warn(`${apiName}, ${JSON.stringify(args)}, \`${error.message}\``);
          }
        }
        return null;
      },
    },
  }), {});

const provider = (graphQLSchema) => async (query, ctx) => {
  const documentAST = parse(new Source(query, ''));
  const validationErrors = validate(graphQLSchema, documentAST, [...specifiedRules]);
  if (validationErrors.length > 0) {
    ctx.throw(400);
  }
  const result = await execute({
    schema: graphQLSchema,
    document: documentAST,
    contextValue: ctx,
  });
  return result.data;
};

export default ({
  queries,
  mutations,
  logger,
}) => {
  const graphQLSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'query',
      fields: generateApis(queries, 'query', logger),
    }),
    mutation: new GraphQLObjectType({
      name: 'mutation',
      fields: generateApis(mutations, 'mutation', logger),
    }),
  });

  return {
    graphQLSchema,
    apiProvider: provider(graphQLSchema),
  };
};
