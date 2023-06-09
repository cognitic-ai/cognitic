<script lang="ts">
  import type { IFileTreeItem } from 'cognitic-models';
  import FileItem from './FileItem.svelte';
  import { selectedEntities } from '../stores/selection';
  import { createEventDispatcher } from 'svelte';
  import ArrowDownIcon from '$lib/shared/components/Icons/ArrowDownIcon.svelte';
  import ArrowRightIcon from '$lib/shared/components/Icons/ArrowRightIcon.svelte';
  import Checkbox from '$lib/shared/components/Checkbox.svelte';

  export let file: IFileTreeItem;
  export let depth = 1;

  $: expanded = file.expanded || false;

  const dispatch = createEventDispatcher<{ expand: IFileTreeItem }>();

  function toggle() {
    expanded = !expanded;
    file.expanded = expanded;
    if (expanded) {
      dispatch('expand', file);
    }
  }

  function sortFileTreeItems(a: IFileTreeItem, b: IFileTreeItem) {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.fileName.localeCompare(b.fileName);
  }

  function isFolderSelected(
    selectedFiles: IFileTreeItem[],
    mustBeIncluded: IFileTreeItem[]
  ) {
    return mustBeIncluded.every((file) =>
      selectedFiles.some((s) => s.filePath === file.filePath)
    );
  }

  $: onlyFiles = file.children.filter((child) => !child.isDirectory);
  $: selectedWithinThisDirectory = $selectedEntities.filter((s) =>
    onlyFiles.some((f) => f.filePath === s.filePath)
  );
  $: folderSelected =
    onlyFiles.length > 0 && isFolderSelected($selectedEntities, onlyFiles);
  $: indeterminate = selectedWithinThisDirectory.length > 0 && !folderSelected;

  function handleFolderCheckboxClick() {
    if (folderSelected) {
      selectedEntities.remove(file.children);
    } else {
      selectedEntities.add(file.children);
    }
  }
</script>

<div
  class="hover:bg-primary flex h-7 w-full items-center pr-6 hover:bg-opacity-10"
>
  <button
    class="flex flex-1 items-center text-start"
    on:click={toggle}
    style="padding-left: calc(1.5rem + (1.25rem * {depth - 1}))"
  >
    {#if expanded}
      <ArrowDownIcon class="h-5 w-5" />
    {:else}
      <ArrowRightIcon class="h-5 w-5" />
    {/if}

    <!-- <div class="ml-1 w-5">
      <svg
        viewBox="0 0 16 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="mx-auto h-4 w-auto"
      >
        <path
          d="M1.75 0C1.28587 0 0.840752 0.184374 0.512563 0.512563C0.184374 0.840752 0 1.28587 0 1.75L0 12.25C0 13.216 0.784 14 1.75 14H14.25C14.7141 14 15.1592 13.8156 15.4874 13.4874C15.8156 13.1592 16 12.7141 16 12.25V3.75C16 3.28587 15.8156 2.84075 15.4874 2.51256C15.1592 2.18437 14.7141 2 14.25 2H7.5C7.46119 2 7.42291 1.99096 7.3882 1.97361C7.35348 1.95625 7.32329 1.93105 7.3 1.9L6.4 0.7C6.07 0.26 5.55 0 5 0H1.75Z"
          fill="#3398FF"
        />
      </svg>
    </div> -->

    <span class="text-content-primarySub body-regular ml-1"
      >{file.fileName}</span
    >
  </button>
  {#if onlyFiles.length > 0}
    <Checkbox
      class="bg-background-primary rignt-0 sticky flex cursor-pointer items-center"
      checkboxClass="w-3 h-3 ml-auto flex-shrink-0"
      checked={folderSelected || indeterminate}
      intermediate={indeterminate}
      on:click={handleFolderCheckboxClick}
    />
  {/if}
</div>

{#if expanded}
  <ul class="w-full">
    {#each file.children.sort(sortFileTreeItems) as f (f.filePath)}
      {@const selected = $selectedEntities.find(
        (s) => s.filePath === f.filePath
      )}
      <li class="flex w-full flex-col items-center">
        {#if f.isDirectory}
          <svelte:self file={f} depth={depth + 1} on:expand />
        {:else}
          <FileItem
            on:click={() => {
              if (selected) {
                selectedEntities.remove(selected);
              } else {
                selectedEntities.add(f);
              }
            }}
            file={f}
            selected={Boolean(selected)}
            depth={depth + 1}
          />
        {/if}
      </li>
    {/each}
  </ul>
{/if}
