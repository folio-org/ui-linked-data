// TODO: potentially refactor to be 'The folio way'
import { LOCALES } from './locales';

export const BASE_LOCALE = {
  'marva.startEditing': 'Start editing.',
  'marva.dashboard': 'My dashboard',
  'marva.search': 'Search',
  'marva.reset': 'Reset',
  'marva.searchResource': 'Search resources',
  'marva.create': 'Create resource',
  'marva.edit': 'Edit',
  'marva.editResource': 'Edit resource',
  'marva.main': 'Main',
  'marva.and': 'AND',
  'marva.or': 'OR',
  'marva.not': 'NOT',
  'marva.saveRd': 'Save resource',
  'marva.closeRd': 'Close resource',
  'marva.deleteRd': 'Delete resource',
  'marva.noAvailableRds': 'No available resource descriptions.',
  'marva.resources': 'Resources',
  'marva.searchBy': 'Search By',
  'marva.searchFor': 'Search for',
  'marva.searchAndFilter': 'Search & filter',
  'marva.enterSearchCriteria': 'Enter search criteria to start search',
  'marva.searchNoRdsMatch': 'No resource descriptions match your query',
  'marva.searchBySth': 'Search by{by}...',
  'marva.errorFetching': 'Error fetching data',
  'marva.errorLoadingResource': 'Error loading resource',
  'marva.actions': 'Actions',
  'marva.isbnLccn': 'ISBN/LCCN',
  'marva.isbn': 'ISBN',
  'marva.lccn': 'LCCN',
  'marva.lcnaf': 'LCNAF',
  'marva.title': 'Title', // TODO: it can be "uppercased" programmatically in SearchTypeSelect.tsx, need to be checked
  'marva.contributor': 'Contributor', // TODO: it can be "uppercased" programmatically in SearchTypeSelect.tsx, need to be checked
  'marva.author': 'Author',
  'marva.pubDate': 'Publication Date',
  'marva.pubDateShort': 'Pub Date',
  'marva.edition': 'Edition',
  'marva.select': 'Select',
  'marva.subclass': 'Subclass',
  'marva.heading': 'Heading',
  'marva.selectForEditing': 'Select a resource description for editing',
  'marva.startFromScratch': 'Start from scratch',
  'marva.selectOrStartFromScratch': '{select} or {startFromScratch}',
  'marva.backToTop': 'Back to top',
  'marva.properties': 'Properties',
  'marva.preview': 'Preview',
  'marva.confirmCloseRd': 'Do you really want to close the resource description? All unsaved changes will be lost.',
  'marva.confirmDeleteRd': 'Do you really want to delete the resource description?',
  'marva.saveClose': 'Save and close',
  'marva.close': 'Close',
  'marva.delete': 'Delete',
  'marva.return': 'Return',
  'marva.rdSaveSuccess': 'Resource created. Expect a short delay before resource is visible in FOLIO.',
  'marva.rdUpdateSuccess': 'Resource updated. Expect a short delay before changes are visible in FOLIO.',
  'marva.cantSaveRd': 'Cannot save the resource description',
  'marva.cantDeleteRd': 'Cannot delete the resource description',
  'marva.rdDeleted': 'Resource description deleted',
  'marva.appFail': 'An error occurred. Please, reload the page.',
  'marva.searchSelectIndex': 'Please select an index',
  'marva.searchInvalidLccn': 'LCCN is invalid, please correct',
  'marva.advancedSearch': 'Advanced search',
  'marva.advanced': 'Advanced',
  'marva.cancel': 'Cancel',
  'marva.resourceId': 'Resource ID',
  'marva.loading': 'Loading...',
  'marva.paginationCount': '{startCount} - {endCount} of {totalResultsCount}',
  'marva.yes': 'Yes',
  'marva.no': 'No',
  'marva.cantLoadSimpleLookupData': 'Cannot load data for a simple lookup',
  'marva.publishDate': 'Publish date',
  'marva.format': 'Format',
  'marva.suppressed': 'Suppressed',
  'marva.notSuppressed': 'Not suppressed',
  'marva.volume': 'Volume',
  'marva.ebook': 'eBook',
  'marva.allTime': 'All time',
  'marva.past12Months': 'Past 12 months',
  'marva.past10Yrs': 'Past 10 years',
  'marva.past5Yrs': 'Past 5 years',
  'marva.customRange': 'Custom range',
  'marva.all': 'All',
  'marva.onlineResource': 'Online resource',
  'marva.startsWith': 'Starts with',
  'marva.containsAll': 'Contains all',
  'marva.exactPhrase': 'Exact phrase',
  'marva.publisher': 'Publisher',
  'marva.creator': 'Creator',
  'marva.language': 'Language',
  'marva.classificationNumber': 'Classification number',
  'marva.work': 'Work',
  'marva.instances': 'Instances',
  'marva.noInstancesAvailable': 'No instances available.',
  'marva.noInstancesAdded': 'No instances added',
  'marva.addAnInstance': 'Add an instance',
  'marva.type': 'Type',
  'marva.expandAll': 'Expand all',
  'marva.collapseAll': 'Collapse all',
  'marva.showAllWithCount': 'Show all ({amt})',
  'marva.showAdditionalComponents': 'Show additional components ({amt})',
  'marva.hideAdditionalComponents': 'Hide additional components',
  'marva.hide': 'Hide',
  'marva.saveAndClose': 'Save & close',
  'marva.saveAndContinue': 'Save & continue',
  'marva.editInstance': 'Edit instance',
  'marva.editWork': 'Edit work',
  'marva.createInstance': 'Create instance',
  'marva.createWork': 'Create work',
  'marva.saveAndKeepEditing': 'Save & keep editing',
  'marva.recordMappingToSchema': 'Cannot apply a record to the schema',
  'marva.newResource': 'New resource',
  'marva.addInstance': 'Add instance',
  'marva.compareSelected': 'Compare selected',
  'marva.newInstance': 'New instance',
  'marva.newWork': 'New work',
  'marva.new': 'New',
  'marva.cantSelectReferenceContents': "Can't select reference contents while fetching a reference",
  'marva.addNewInstance': 'Add new instance',
  'marva.askSaveChangesBeforeProceeding': 'Would you like to save your changes before proceeding?',
  'marva.unsavedRecentEdits': 'Recent edits made to the resource have not been saved. Unsaved changes will be lost.',
  'marva.unsavedChanges': 'Unsaved changes',
  'marva.continueWithoutSaving': 'Continue without saving',
  'marva.noTitleInBrackets': '<No title>',
  'marva.viewMarc': 'View MARC',
  'marva.marcWithTitle': 'MARC - {title}',
  'marva.cantLoadMarc': "Can't load MARC for this resource description",
  'marva.duplicate': 'Duplicate',
  'marva.viewLinkedData': 'View linked data',
  'marva.viewInInventory': 'View in Inventory app',
  'marva.authorityType': 'Authority Type',
  'marva.person': 'Person',
  'marva.source': 'Source',
  'marva.family': 'Family',
  'marva.corporateBody': 'Corporate body',
  'marva.jurisdiction': 'Jurisdiction',
  'marva.conference': 'Conference',
  'marva.authorized': 'Authorized',
  'marva.unauthorized': 'Unauthorized',
  'marva.assign': 'Assign',
  'marva.assignAuthority': 'Assign authority',
  'marva.change': 'Change',
  'marva.searchCreatorAuthority': 'Search creator authority',
  'marva.authorities': 'Authorities',
  'marva.keyword': 'Keyword',
  'marva.recordsFound': '{recordsCount} records found',
  'marva.resourceWithIdIsEmpty': 'Resource description {id} is empty',
};

export const i18nMessages = {
  [LOCALES.ENGLISH]: BASE_LOCALE,
  [LOCALES.GERMAN]: {
    ...BASE_LOCALE,
    'marva.startEditing': 'Bearbeitung starten.',
    'marva.dashboard': 'Mein Armaturenbrett',
    'marva.search': 'Ressourcen durchsuchen',
    'marva.create': 'Ressource erstellen',
    'marva.edit': 'Ressource bearbeiten',
    'marva.main': 'Haupt',
    'marva.saveRd': 'Ressource sparen',
    'marva.closeRd': 'Ressource schließen',
    'marva.deleteRd': 'Ressource löschen',
    'marva.noAvailableRds': 'Keine verfügbaren Ressourcenbeschreibungen.',
    'marva.resources': 'Ressourcen',
    'marva.searchBy': 'Suche nach',
    'marva.searchNoRdsMatch': 'Keine Ressourcenbeschreibungen stimmen mit Ihrer Suchanfrage überein',
    'marva.searchBySth': 'Suche nach{by}...',
    'marva.errorFetching': 'Fehler beim Abrufen der Daten',
    'marva.errorLoadingResource': 'Fehler beim Laden der Ressource',
    'marva.actions': 'Aktionen',
    'marva.isbnLccn': 'ISBN/LCCN',
    'marva.isbn': 'ISBN',
    'marva.lccn': 'LCCN',
    'marva.title': 'Titel', // TODO: it can be "uppercased" programmatically in SearchTypeSelect.tsx, need to be checked
    'marva.contributor': 'Mitwerkender', // TODO: it can be "uppercased" programmatically in SearchTypeSelect.tsx, need to be checked
    'marva.author': 'Autor',
    'marva.pubDate': 'Veröffentlichungsdatum',
    'marva.edition': 'Edition',
    'marva.selectForEditing': 'Wählen Sie eine Ressourcenbeschreibung zur Bearbeitung aus',
    'marva.startFromScratch': 'Von vorne beginnen',
    'marva.selectOrStartFromScratch': '{select} oder {startFromScratch}',
    'marva.backToTop': 'Zurück nach oben',
    'marva.properties': 'Eigenschaften',
    'marva.preview': 'Vorschau',
    'marva.confirmCloseRd':
      'Möchten Sie die Ressourcenbeschreibung wirklich schließen? Alle nicht gespeicherten Änderungen gehen verloren.',
    'marva.confirmDeleteRd': 'Möchten Sie die Ressourcenbeschreibung wirklich löschen?',
    'marva.saveClose': 'Speichern und schließen',
    'marva.close': 'Schließen',
    'marva.delete': 'Löschen',
    'marva.return': 'Zurück',
    'marva.rdSaveSuccess': 'Ressourcenbeschreibung erfolgreich gespeichert',
    'marva.cantSaveRd': 'Die Ressourcenbeschreibung kann nicht gespeichert werden',
    'marva.cantDeleteRd': 'Die Ressourcenbeschreibung kann nicht gelöscht werden',
    'marva.rdDeleted': 'Ressourcenbeschreibung gelöscht',
    'marva.appFail': 'Es ist ein Fehler aufgetreten. Bitte laden Sie die Seite neu.',
    'marva.searchSelectIndex': 'Bitte wählen Sie ein Index',
    'marva.resourceId': 'Ressource ID',
    'marva.loading': 'Wird geladen...',
    'marva.paginationCount': '{startCount} - {endCount} von {totalResultsCount}',
    'marva.yes': 'Ja',
    'marva.no': 'Nein',
    'marva.cantLoadSimpleLookupData': 'Daten können nicht für eine einfache Suche gespeichert werden',
    'marva.recordMappingToSchema': 'Ein Datensatz kann nicht auf das Schema angewendet werden',
    'marva.newResource': 'Neue Ressource',
    'marva.compareSelected': 'Ausgewählte vergleichen',
  },
  [LOCALES.JAPANESE]: {
    ...BASE_LOCALE,
  },
  [LOCALES.FRENCH]: {
    ...BASE_LOCALE,
  },
};
