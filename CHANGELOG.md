# Change history for ui-linked-data

## 1.1.0 (IN PROGRESS)
* Clear global state on web component disconnection. Refs [UILD-552].
 
[UILD-552]:https://folio-org.atlassian.net/browse/UILD-552

## 1.0.4 (IN PROGRESS)
* Added "selectedEntries" property to compared resources to properly render dropdown options. Fixes [UILD-533]
* Update blocker logic in Prompt component and add fetchableId check in Edit component. Fixes [UILD-543]
* Search query shows slashes when entered value has quotation marks. Fixes [UILD-535].
* Fix double title shown when importing after marc preview is opened. Fixex [UILD-534].

[UILD-533]: https://folio-org.atlassian.net/browse/UILD-533
[UILD-543]:https://folio-org.atlassian.net/browse/UILD-543
[UILD-535]: https://folio-org.atlassian.net/browse/UILD-535
[UILD-534]: https://folio-org.atlassian.net/browse/UILD-534


## 1.0.3 (2025-04-08)
* Empty header cell in table changed from `<th>` to `<td>`. Fixes [UILD-485]
* A11y enhanced by including resource titles in ARIA labels for buttons and checkboxes in Search results table. Fixes [UILD-486]
* Implement updateTwinChildrenEntry method to synchronize UUIDs in twin children on entry updates. Fixes [UILD-492]
* Refactor `useSearch` hook to use `searchParams` when making API calls after clicking pagination button. Fixes [UILD-517]
* Add history action check to blocker to prevent navigation blocking on back button. Fixes [UILD-532]

[UILD-485]:https://folio-org.atlassian.net/browse/UILD-485
[UILD-486]:https://folio-org.atlassian.net/browse/UILD-486
[UILD-492]:https://folio-org.atlassian.net/browse/UILD-492
[UILD-517]:https://folio-org.atlassian.net/browse/UILD-517
[UILD-532]:https://folio-org.atlassian.net/browse/UILD-532

## 1.0.2 (2025-03-27)
* Several modals shown at once/Wrong app background colour when Advanced search modal is opened. Fixes [UILD-506]. 
* Comparison Mode Refinement - Numbered icons. Refs [UILD-475].
* Read-only Instance screen: Correctly redirect after clicking 'Cancel' and 'X' buttons. Fixes [UILD-449].
* Work creator subclass doesn't show in read-only mode. [UILD-524].

[UILD-506]:https://folio-org.atlassian.net/browse/UILD-506
[UILD-475]:https://folio-org.atlassian.net/browse/UILD-475
[UILD-449]:https://folio-org.atlassian.net/browse/UILD-449
[UILD-524]:https://folio-org.atlassian.net/browse/UILD-524

## 1.0.1 (2025-03-12)
* Initial release

