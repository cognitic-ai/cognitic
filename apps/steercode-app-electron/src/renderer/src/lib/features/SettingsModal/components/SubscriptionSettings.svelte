<script lang="ts">
  import { trackEvent } from '$lib/core/services/tracking';
  import AuthButton from '$lib/features/Auth/components/AuthButton.svelte';
  import Button from '$lib/shared/components/Button.svelte';
  import { remoteConfig } from '$lib/shared/stores/remoteConfig';
  import { user } from '$lib/shared/stores/user';
  import { _ } from 'svelte-i18n';

  $: isPremium = user.isPremium($user);
</script>

<div class="text-content-secondary body-regular flex flex-col gap-6">
  <p class="headline-small text-content-primarySub mb-4">
    {$_('settings.subscription.description')}
  </p>

  {#if !$user}
    <p class="text-content-secondary body-regular mx-auto my-4">
      {$_('settings.subscription.noUserDescription')}
    </p>
    <div class="mx-auto">
      <AuthButton />
    </div>
  {:else}
    {#if $remoteConfig && !isPremium}
      <Button
        as="a"
        href={$remoteConfig.stripe_checkout_url +
          '?client_reference_id=' +
          $user.uid +
          '&prefilled_email=' +
          $user.email}
        on:click={() => {
          trackEvent('subscribe', { from: 'settings' });
        }}
        target="_blank"
        rel="noopener noreferrer"
        variant="tertiary"
        class="mx-auto w-52"
      >
        {$_('settings.subscription.subscribe.button')}
      </Button>
      <p class="text-content-secondary body-small mb-4">
        {$_('settings.subscription.subscribe.description')}
      </p>
    {:else}
      <h3 class="text-content-secondary headline-small mb-4">
        {$_('settings.subscription.subscribe.subscriber')}
      </h3>
    {/if}
    {#if $remoteConfig && isPremium}
      <div class="flex flex-wrap">
        <p class="text-content-secondary body-small mr-1">
          {$_('settings.subscription.manageSubscription.description')}
        </p>
        <a
          href={$remoteConfig.stripe_user_portal_url}
          on:click={() => {
            trackEvent('Manage subscription');
          }}
          target="_blank"
          rel="noopener noreferrer"
          class="text-content-primarySub hover:text-content-primary body-small inline-block hover:underline"
        >
          {$_('settings.subscription.manageSubscription.button')}
        </a>
      </div>
    {/if}
  {/if}
</div>
