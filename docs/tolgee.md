# Handling translation keys with Tolgee

This guide explains how to use **Tolgee** for localization in your project, specifically **how to add new keys and synchronize them with the Tolgee platform.**

## Main commands

You will find the following commands in the `package.json` (and some more):

```json
"scripts": {
  "tolgee:compare": "pnpm tolgee compare --config ./apps/shell/.tolgeerc.js", // Shows new and unused keys
  "tolgee:sync": "pnpm tolgee sync --config ./apps/shell/.tolgeerc.js" // Synchronizes keys with Tolgee platform
}
```

## Example Workflow in Practice

1. **Add a New Key**:
   Add a new string in your code:

   ```jsx
   <div className="font-clash text-pink-300">
     {t('newKey', 'This is a new key', { ns: 'common' })}
   </div>
   ```

2. **Compare Keys**:
   Run the following command to check for new and unused keys:

   ```bash
   pnpm run tolgee:compare
   ```

   You will see that the new key 'newKey' has been detected.

3. **Synchronize Keys**:
   Synchronize the updated keys with the Tolgee platform:

   ```bash
   pnpm run tolgee:sync
   ```

   You can add optional flags here, for example the `--remove-unused` flag. [More options here.](https://docs.tolgee.io/tolgee-cli/extraction/syncing-strings#synchronizing-projects)

## Additional Resources

- **Full Tolgee CLI Documentation**: [https://docs.tolgee.io/tolgee-cli/](https://docs.tolgee.io/tolgee-cli/)
- **Syncing Strings**: [https://docs.tolgee.io/tolgee-cli/extraction/syncing-strings](https://docs.tolgee.io/tolgee-cli/extraction/syncing-strings)
