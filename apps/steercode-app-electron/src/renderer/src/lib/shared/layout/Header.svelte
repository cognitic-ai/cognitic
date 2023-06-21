<script lang="ts">
  import Divider from '../components/Divider.svelte';
  import ActivityFeedIcon from '../components/Icons/ActivityFeedIcon.svelte';
  import LogoIcon from '../components/Icons/LogoIcon.svelte';
  // import { locale, locales } from 'svelte-i18n';
  import { _ } from 'svelte-i18n';
  import LogoText from '../components/Icons/LogoText.svelte';
  import Listbox, { type Option } from '../components/Listbox/Listbox.svelte';
  import type { RepositoryOption } from '$lib/models/types/conversation.type';
  import PlusIcon from '../components/Icons/PlusIcon.svelte';
  import FolderIcon from '../components/Icons/FolderIcon.svelte';
  import {
    recentRepositories,
    selectedRepositoryStore
  } from '../stores/recentRepositories';
  import { goto } from '$app/navigation';
  import { handleImportRepo } from '$lib/features/CodebasesDashboard/utils';
  import { user } from '$lib/shared/stores/user';
  import AuthButton from '$lib/features/Auth/components/AuthButton.svelte';
  import Button from '../components/Button.svelte';
  import { remoteConfig } from '../stores/remoteConfig';
  import { trackEvent } from '$lib/core/services/tracking';

  export let enableMenuButton: boolean = true;
  export let sidebarOpen: boolean;
  export let logoOnly: boolean = false;
  export let hideListbox: boolean = false;

  function handleListboxChange(opt: Option<RepositoryOption>) {
    if (opt.label === 'new-import') {
      handleImportRepo();
      return;
    }

    const repo: RepositoryOption = {
      url: opt.value.url,
      name: opt.value.url.split('/').pop() || opt.value.url,
      description: opt.value.description
    };
    recentRepositories.setSelected(repo);

    goto('/new');
  }

  function getLabelPartsForRepo(selectedRepo: RepositoryOption) {
    const paths = selectedRepo.url.split('/');
    return {
      end: paths[paths.length - 1],
      start: paths[paths.length - 2]
    };
  }

  function createOptions(items: RepositoryOption[]) {
    const options: Option<RepositoryOption>[] = [];

    items.forEach((item) => {
      const parts = getLabelPartsForRepo(item);
      options.push({
        label: parts.start + ' / ' + parts.end,
        value: item
      });
    });

    options.push({
      label: 'new-import',
      value: {
        url: '',
        name: ''
      }
    });

    return options;
  }

  $: recentRepositoriesOptions = createOptions($recentRepositories);

  $: isPremium = user.isPremium($user);
</script>

<svelte:window on:resize={() => (sidebarOpen = window.innerWidth > 768)} />

<header class="sticky top-0 z-20" style={$$props.style}>
  <span class="bg-background-primary flex h-16 items-center px-6">
    <a href="/" class="flex items-center">
      <LogoIcon class="mr-2 h-6 w-6" />
      {#if !logoOnly}
        <LogoText class="h-4" />
      {/if}
    </a>
    <div
      class="bg-background-secondaryActive text-content-primarySub label-small-plus mx-2.5 flex h-5 items-center px-2.5"
      style="font-size: 11px;"
    >
      {$user ? (isPremium ? 'PREMIUM' : 'FREE') : 'BETA'}
    </div>

    {#if !hideListbox}
      <div class="group flex items-center">
        {#if $selectedRepositoryStore !== null}
          <Listbox
            expandFirst
            options={recentRepositoriesOptions}
            selected={{ label: '', value: $selectedRepositoryStore }}
            on:change={(e) => {
              handleListboxChange(e.detail);
            }}
            let:option
            let:selected
          >
            <div slot="selected-option" class="">
              {@const labelParts = getLabelPartsForRepo(
                $selectedRepositoryStore
              )}
              <span class="text-content-secondary headline-large">
                {labelParts.start + ' / '}
              </span>
              <span class="text-content-primary headline-large ml-2">
                {labelParts.end}
              </span>
            </div>

            {#if option.label === 'new-import'}
              <div class="flex flex-col">
                <Divider class="w-full" />
                <div
                  class="text-content-secondary hover:text-content-primary label-small flex h-9 items-center"
                >
                  <PlusIcon class="mr-2 h-4 w-4" />
                  {$_('header.importRepoButton')}
                </div>
              </div>
            {:else}
              <div
                class="{selected
                  ? 'text-content-primary'
                  : 'text-content-secondary'} label-small flex h-9 items-center"
              >
                <FolderIcon class="mr-2 h-4 w-4" />
                {option.label}
              </div>
            {/if}
          </Listbox>
        {/if}
      </div>
    {/if}

    <div role="separator" class="ml-4 flex-1" />
    <!-- <div class="flex flex-1 items-center justify-end">
      <Listbox
        selected={{ label: $locale || 'unknown', value: $locale }}
        on:change={(e) => {
          locale.set(e.detail.value);
          localStorage.setItem('cognitic.locale', e.detail.value);
        }}
        options={$locales.map((l) => {
          return {
            label: l,
            value: l
          };
        })}
      />
    </div> -->
    {#if enableMenuButton}
      <button
        class="mr-3 block md:hidden"
        on:click={() => (sidebarOpen = !sidebarOpen)}
      >
        <ActivityFeedIcon class="h-8 w-8" />
      </button>
    {/if}

    {#if !isPremium}
      <Button
        class="mr-4 hidden md:block"
        variant="primary"
        size="medium"
        on:click={() => {
          trackEvent('subscribe', { from: 'header' });
          if ($user) {
            window.open(
              $remoteConfig.stripe_checkout_url +
                '?client_reference_id=' +
                $user.uid +
                '&prefilled_email=' +
                $user.email,
              '_blank'
            );
            return;
          }
          window.open('https://steercode.com/auth-steercode');
        }}
      >
        {$_('header.subscribeButton')}
      </Button>
    {/if}
    <AuthButton />
  </span>

  <Divider />
</header>
