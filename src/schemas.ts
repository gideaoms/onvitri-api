export const schemas = {
  city: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    initials: {
      type: 'string',
    },
  },

  store: {
    id: {
      type: 'string',
    },
    fantasy_name: {
      type: 'string',
    },
    street: {
      type: 'string',
    },
    number: {
      type: 'number',
    },
    neighborhood: {
      type: 'string',
    },
    phone: {
      type: 'object',
      properties: {
        country_code: {
          type: 'string',
        },
        area_code: {
          type: 'string',
        },
        number: {
          type: 'string',
        },
      },
    },
    zip_code: {
      type: 'string',
    },
    status: {
      type: 'string',
    },
  },

  product: {
    id: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    price: {
      type: 'integer',
      minimum: 1,
    },
    status: {
      type: 'string',
    },
    pictures: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          variants: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                },
                ext: {
                  type: 'string',
                },
                name: {
                  type: 'string',
                },
                size: {
                  type: 'string',
                },
                width: {
                  type: 'integer',
                },
                height: {
                  type: 'integer',
                },
              },
            },
          },
        },
      },
    },
  },

  user: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    roles: {
      type: 'array',
      format: 'string',
    },
    status: {
      type: 'string',
    },
    token: {
      type: 'string',
    },
  },
};
