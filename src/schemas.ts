import { Type } from '@sinclair/typebox';

export const CitySchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  initials: Type.String(),
});

export const StoreSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  fantasy_name: Type.String(),
  street: Type.String(),
  number: Type.String(),
  neighborhood: Type.String(),
  phone: Type.Object({
    country_code: Type.String(),
    area_code: Type.String(),
    number: Type.String(),
  }),
  zip_code: Type.String(),
  status: Type.String(),
});

export const ProductSchema = Type.Object({
  id: Type.String(),
  store_id: Type.String({ format: 'uuid' }),
  title: Type.String(),
  description: Type.String(),
  price: Type.Integer(),
  status: Type.Enum({ active: 'active' as const, inactive: 'inactive' as const }),
  pictures: Type.Array(
    Type.Object({
      id: Type.String({ format: 'uuid' }),
      variants: Type.Array(
        Type.Object({
          url: Type.String(),
          ext: Type.String(),
          name: Type.String(),
          size: Type.Enum({ sm: 'sm' as const, md: 'md' as const }),
          width: Type.Integer(),
          height: Type.Integer(),
        }),
      ),
    }),
  ),
});

export const UserSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  email: Type.String(),
  roles: Type.Array(Type.String()),
  status: Type.String(),
  token: Type.String(),
});
