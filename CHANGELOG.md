# Change history for ui-linked-data

## 2.0.0 (IN PROGRESS)
* Remove unnecessary child subcomponents when copying a whole field when the record is loaded. Fixes [UILD-544].
* Clear global state on web component disconnection. Refs [UILD-552].
* Fixed incorrect instances list display when the user opens the Create Work page. Fixes [UILD-560].
* Added a service to process a new custom profile. Extended logic to apply this service. Refs [UILD-546].
* Extended services to process the loaded record using the updated profile. Refs [UILD-547].
* Added import file action. Refs [UILD-561], [UILD-568].
* Added and utilized a new API request to get the new custom profile. Refs [UILD-571].
* Added new services for the record generation. Refs [UILD-548].
* Removed unused code after introducing the new profile. Remove BF2-BFLite mapping. Refs [UILD-550].
* Extended configs to add support for Subject of Work. Refs [UILD-555].
* Added export RDF file action. Refs [UILD-587].
* Address general accessibility issues with focus. Refs [UILD-579].
* Loading separate profiles for Work and Instance on the Create resource page. Refs [UILD-578].
* Add support for administrative history, biographical data, physical description, accompanying material and award notes. Refs [UILD-569].
* Address accessibility issues. Refs [UILD-579].
* Add support for serials. Refs [UILD-594].
* Add support for updated extent handling. Refs [UILD-557].
* Added Profile selection when the user creates a new Instance. Refs[UILD-573].
* Add support for dates of publication note (MARC 362). Refs [UILD-606].
* Add support for book format. Refs [UILD-607].
* Add support for supplementary content. Refs [UILD-611].
* Add language subclass support.  Refs [UILD-564].
* Open Instance using associated profile's Edit/Display form. Refs [UILD-575].
* Add characteristic / serial publication type support. Refs [UILD-604].

[UILD-552]:https://folio-org.atlassian.net/browse/UILD-552
[UILD-544]:https://folio-org.atlassian.net/browse/UILD-544
[UILD-560]:https://folio-org.atlassian.net/browse/UILD-560
[UILD-546]:https://folio-org.atlassian.net/browse/UILD-546
[UILD-547]:https://folio-org.atlassian.net/browse/UILD-547
[UILD-561]:https://folio-org.atlassian.net/browse/UILD-561
[UILD-568]:https://folio-org.atlassian.net/browse/UILD-568
[UILD-571]:https://folio-org.atlassian.net/browse/UILD-571
[UILD-548]:https://folio-org.atlassian.net/browse/UILD-548
[UILD-550]:https://folio-org.atlassian.net/browse/UILD-550
[UILD-555]:https://folio-org.atlassian.net/browse/UILD-555
[UILD-587]:https://folio-org.atlassian.net/browse/UILD-587
[UILD-579]:https://folio-org.atlassian.net/browse/UILD-579
[UILD-578]:https://folio-org.atlassian.net/browse/UILD-578
[UILD-569]:https://folio-org.atlassian.net/browse/UILD-569
[UILD-579]:https://folio-org.atlassian.net/browse/UILD-579
[UILD-594]:https://folio-org.atlassian.net/browse/UILD-594
[UILD-557]:https://folio-org.atlassian.net/browse/UILD-557
[UILD-573]:https://folio-org.atlassian.net/browse/UILD-573
[UILD-606]:https://folio-org.atlassian.net/browse/UILD-606
[UILD-607]:https://folio-org.atlassian.net/browse/UILD-607
[UILD-611]:https://folio-org.atlassian.net/browse/UILD-611
[UILD-564]:https://folio-org.atlassian.net/browse/UILD-564
[UILD-575]:https://folio-org.atlassian.net/browse/UILD-575
[UILD-604]:https://folio-org.atlassian.net/browse/UILD-604

## 1.0.5 (2025-04-30)
* Fixed incorrect behavior when navigating between duplicated resources. Fixes [UILD-553].
* Browser Back button navigates to Edit without duplicated title when navigated from Duplicate screen. Fixes [UILD-554].

[UILD-553]:https://folio-org.atlassian.net/browse/UILD-553
[UILD-554]:https://folio-org.atlassian.net/browse/UILD-554

## 1.0.4 (2025-04-24)
* Added "selectedEntries" property to compared resources to properly render dropdown options. Fixes [UILD-533]
* Update blocker logic in Prompt component and add fetchableId check in Edit component. Fixes [UILD-543]
* Search query shows slashes when entered value has quotation marks. Fixes [UILD-535].
* Fix double title shown when importing after marc preview is opened. Fixes [UILD-534].
* Add safe formatting to the console error message. Fixes [UILD-526].
* Clear MARC preview state to display controls on the External Preview pane. Fixes [UILD-534].
* Fix text alignment for details title in Search results set. Fixes [UILD-529].
* Fixed table header cell styles: empty cells did not have the required bottom border and had excess borders. Fixes [UILD-545]

[UILD-533]:https://folio-org.atlassian.net/browse/UILD-533
[UILD-543]:https://folio-org.atlassian.net/browse/UILD-543
[UILD-535]:https://folio-org.atlassian.net/browse/UILD-535
[UILD-534]:https://folio-org.atlassian.net/browse/UILD-534
[UILD-535]: https://folio-org.atlassian.net/browse/UILD-535
[UILD-534]: https://folio-org.atlassian.net/browse/UILD-534
[UILD-526]: https://folio-org.atlassian.net/browse/UILD-526
[UILD-529]: https://folio-org.atlassian.net/browse/UILD-529
[UILD-545]: https://folio-org.atlassian.net/browse/UILD-545


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

