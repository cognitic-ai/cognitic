<script lang="ts">
  import ActivityFeedIcon from '$lib/shared/components/Icons/ActivityFeedIcon.svelte';
  import AddCircleIcon from '$lib/shared/components/Icons/AddCircleIcon.svelte';
  import ArrowDownIcon from '$lib/shared/components/Icons/ArrowDownIcon.svelte';
  import ArrowRightIcon from '$lib/shared/components/Icons/ArrowRightIcon.svelte';
  import ArrowUpIcon from '$lib/shared/components/Icons/ArrowUpIcon.svelte';
  import BinIcon from '$lib/shared/components/Icons/BinIcon.svelte';
  import BroomIcon from '$lib/shared/components/Icons/BroomIcon.svelte';
  import CancelCircleIcon from '$lib/shared/components/Icons/CancelCircleIcon.svelte';
  import ClockIcon from '$lib/shared/components/Icons/ClockIcon.svelte';
  import CloseIcon from '$lib/shared/components/Icons/CloseIcon.svelte';
  import CopyIcon from '$lib/shared/components/Icons/CopyIcon.svelte';
  import CreateIcon from '$lib/shared/components/Icons/CreateIcon.svelte';
  import DiscordIcon from '$lib/shared/components/Icons/DiscordIcon.svelte';
  import DoneIcon from '$lib/shared/components/Icons/DoneIcon.svelte';
  import ErrorIcon from '$lib/shared/components/Icons/ErrorIcon.svelte';
  import ExpandIcon from '$lib/shared/components/Icons/ExpandIcon.svelte';
  import FilterIcon from '$lib/shared/components/Icons/FilterIcon.svelte';
  import FullscreenIcon from '$lib/shared/components/Icons/FullscreenIcon.svelte';
  import GitHubIcon from '$lib/shared/components/Icons/GitHubIcon.svelte';
  import GlobeIcon from '$lib/shared/components/Icons/GlobeIcon.svelte';
  import GoogleIcon from '$lib/shared/components/Icons/GoogleIcon.svelte';
  import HeartIcon from '$lib/shared/components/Icons/HeartIcon.svelte';
  import InfoIcon from '$lib/shared/components/Icons/InfoIcon.svelte';
  import IntermediateCheckboxIcon from '$lib/shared/components/Icons/IntermediateCheckboxIcon.svelte';
  import LinkIcon from '$lib/shared/components/Icons/LinkIcon.svelte';
  import MessagingIcon from '$lib/shared/components/Icons/MessagingIcon.svelte';
  import MinusCircleIcon from '$lib/shared/components/Icons/MinusCircleIcon.svelte';
  import MinusIcon from '$lib/shared/components/Icons/MinusIcon.svelte';
  import PauseIcon from '$lib/shared/components/Icons/PauseIcon.svelte';
  import PlusIcon from '$lib/shared/components/Icons/PlusIcon.svelte';
  import ProtectIcon from '$lib/shared/components/Icons/ProtectIcon.svelte';
  import RefreshIcon from '$lib/shared/components/Icons/RefreshIcon.svelte';
  import SearchIcon from '$lib/shared/components/Icons/SearchIcon.svelte';
  import SendIcon from '$lib/shared/components/Icons/SendIcon.svelte';
  import SettingsIcon from '$lib/shared/components/Icons/SettingsIcon.svelte';
  import SortDownIcon from '$lib/shared/components/Icons/SortDownIcon.svelte';
  import SortUpIcon from '$lib/shared/components/Icons/SortUpIcon.svelte';
  import SuspiciousIcon from '$lib/shared/components/Icons/SuspiciousIcon.svelte';
  import TagIcon from '$lib/shared/components/Icons/TagIcon.svelte';
  import ThumbsDownIcon from '$lib/shared/components/Icons/ThumbsDownIcon.svelte';
  import ThumbsUpIcon from '$lib/shared/components/Icons/ThumbsUpIcon.svelte';
  import TooltipIcon from '$lib/shared/components/Icons/TooltipIcon.svelte';
  import TwitterIcon from '$lib/shared/components/Icons/TwitterIcon.svelte';
  import VerifiedIcon from '$lib/shared/components/Icons/VerifiedIcon.svelte';
  import WalletIcon from '$lib/shared/components/Icons/WalletIcon.svelte';
  import WarningIcon from '$lib/shared/components/Icons/WarningIcon.svelte';

  const icons = [
    ActivityFeedIcon,
    AddCircleIcon,
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    BinIcon,
    BroomIcon,
    CancelCircleIcon,
    ClockIcon,
    CopyIcon,
    CreateIcon,
    ClockIcon,
    CloseIcon,
    DiscordIcon,
    DoneIcon,
    ErrorIcon,
    ExpandIcon,
    FilterIcon,
    FullscreenIcon,
    GitHubIcon,
    GlobeIcon,
    GoogleIcon,
    HeartIcon,
    InfoIcon,
    IntermediateCheckboxIcon,
    LinkIcon,
    MessagingIcon,
    MinusCircleIcon,
    MinusIcon,
    PauseIcon,
    PlusIcon,
    ProtectIcon,
    RefreshIcon,
    SearchIcon,
    SendIcon,
    SettingsIcon,
    SortDownIcon,
    SortUpIcon,
    SuspiciousIcon,
    TagIcon,
    ThumbsUpIcon,
    ThumbsDownIcon,
    TooltipIcon,
    TwitterIcon,
    VerifiedIcon,
    WalletIcon,
    WarningIcon
  ];
</script>

<div class="h-full overflow-auto">
  <h1 class="headline-large m-6">Icons</h1>

  <section class="my-14 grid grid-cols-4 place-content-center gap-x-3 gap-y-6">
    {#each icons as icon}
      <div class="flex flex-col items-center">
        <svelte:component this={icon} class="h-8 w-8" />
        <div>{icon.name?.replace('Proxy', '') || '<???>'}</div>
      </div>
    {/each}
  </section>
</div>
