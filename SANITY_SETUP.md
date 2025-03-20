# Setting Up Sanity CMS for FrankX.AI

This document provides instructions for setting up a Sanity CMS project to work with the FrankX.AI platform.

## Prerequisites

- Node.js (v14.x or later)
- npm or yarn
- Sanity CLI installed globally (`npm install -g @sanity/cli`)

## Creating a Sanity Project

1. **Initialize a new Sanity project**:

```bash
# Create a new directory for your Sanity project
mkdir frankx-sanity-cms
cd frankx-sanity-cms

# Initialize a new Sanity project
sanity init
```

During initialization:
- Create a new project (or use an existing one)
- Use the "Blog" schema template when prompted
- Choose your preferred styling option

2. **Modify the schemas to match FrankX requirements**:

Replace or update the post schema in `schemas/post.js` with the schema from `sanity-schema-reference.js`. Make sure all required fields are present to maintain compatibility with the FrankX.AI platform.

3. **Configure CORS settings**:

In your Sanity management console (https://manage.sanity.io/):
- Go to your project
- Navigate to API settings
- Add your FrankX.AI application URL to the CORS origins list
- Enable credentials if needed

4. **Deploy your Sanity Studio**:

```bash
sanity deploy
```

This makes your Sanity Studio accessible from a web URL.

## Getting API Credentials

1. **Create an API token**:

In your Sanity management console:
- Go to your project
- Navigate to API settings
- Create a new token with "Editor" permissions
- Copy the token value

2. **Configure FrankX.AI with Sanity credentials**:

Update your `.env` file with:

```
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production  # or whatever dataset name you chose
SANITY_API_TOKEN=your-api-token
```

## Testing the Integration

1. **Create a test post in Sanity Studio**
2. **Check if it appears in FrankX.AI**:
   - Visit the blog section in your FrankX.AI application
   - The post should be visible if the integration is working correctly

## Migrating Content (Optional)

If you have existing content in the file-based system or Ghost CMS, you can migrate it to Sanity using the Sanity Import tool:

1. **Export your existing content** to a NDJSON format
2. **Install Sanity Import**:
   ```bash
   npm install -g @sanity/import
   ```
3. **Import your content**:
   ```bash
   sanity dataset import your-export-file.ndjson production
   ```

## Troubleshooting

- If posts aren't appearing, check the console logs for any API errors
- Verify that your Sanity dataset is not empty
- Ensure the API token has proper permissions
- Check that the CORS settings allow requests from your application

## Advanced Configuration

For more advanced Sanity configurations, including custom content types, schemas, and plugins, refer to the [Sanity documentation](https://www.sanity.io/docs).