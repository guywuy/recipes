import type { TinaField } from 'tinacms'
export function recipeFields() {
  return [
    {
      type: 'string',
      name: 'title',
      label: 'TItle',
    },
    {
      type: 'string',
      name: 'icon',
      label: 'Icon',
      required: true,
    },
    {
      type: 'string',
      name: 'tags',
      label: 'Recipe Type',
      options: ['meal', 'sauce', 'baking', 'snack', 'drink', 'pickle'],
    },
    {
      type: 'string',
      name: 'ingredients',
      label: 'Main ingredients',
      list: true,
      ui: {
        component: 'tags',
      },
    },
    {
      type: 'string',
      name: 'sources',
      label: 'Sources',
      list: true,
    },
    {
      type: 'string',
      name: 'preptime',
      label: 'Preptime',
    },
    {
      type: 'string',
      name: 'cooktime',
      label: 'Cooktime',
    },
    {
      type: 'string',
      name: 'totaltime',
      label: 'Totaltime',
    },
    {
      type: 'string',
      name: 'diettype',
      label: 'DietType',
      options: ['omnivore', 'vegan', 'vegetarian'],
    },
    {
      type: 'boolean',
      name: 'is_markdown',
      label: 'Is Markdown',
    },
    {
      type: 'boolean',
      name: 'draft',
      label: 'Is Draft?',
    },
    {
      type: 'string',
      name: 'layout',
      label: 'Layout',
    },
  ] as TinaField[]
}
