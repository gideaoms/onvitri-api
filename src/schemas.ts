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
    },
    status: {
      type: 'string',
    },
    photos: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          url: {
            type: 'string',
          },
          thumbnail_url: {
            type: 'string',
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
