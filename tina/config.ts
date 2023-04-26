import { defineConfig } from 'tinacms'
import { recipeFields } from './templates'

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main'

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID || null, // Get this from tina.io
  token: process.env.TINA_TOKEN || null, // Get this from tina.io
  client: { skip: true },
  build: {
    outputFolder: 'admin',
    publicFolder: 'static',
  },
  media: {
    tina: {
      mediaRoot: '',
      publicFolder: 'static',
    },
  },
  schema: {
    collections: [
      {
        format: 'md',
        label: 'Recipes',
        name: 'recipes',
        path: 'src',
        match: {
          include: '*',
        },
        defaultItem: () => {
          return {
            // When a new post is created the title field will be set to "New post"
            title: 'New Post',
            layout: 'recipe',
            is_markdown: true,
            draft: true,
            diettype: 'omnivore',
            body: {
              type: 'root',
              children: [
                {
                  type: 'h2',
                  children: [
                    {
                      type: 'text',
                      text: 'Ingredients',
                    },
                  ],
                },
                {
                  type: 'p',
                  children: [
                    {
                      type: 'text',
                      text: 'Makes {% editable 4 %} portions',
                    },
                  ],
                },
                {
                  type: 'p',
                  children: [
                    {
                      type: 'text',
                      text: 'Controlled amount code -> {% controlled 250 %}ml',
                    },
                  ],
                },
                {
                  type: 'hr',
                  children: [],
                },
                {
                  type: 'h2',
                  children: [
                    {
                      type: 'text',
                      text: 'Method',
                    },
                  ],
                },
                {
                  type: 'p',
                  children: [
                    {
                      type: 'text',
                      text: "Tooltip code -> {% tooltip 'wine', 250, 'ml' %}",
                    },
                  ],
                },
              ],
            },
          }
        },
        fields: [
          {
            type: 'rich-text',
            name: 'body',
            label: 'Recipe Content',
            description: 'Add the ingredients, method and notes',
            isBody: true,
          },
          ...recipeFields(),
        ],
      },
    ],
  },
})
