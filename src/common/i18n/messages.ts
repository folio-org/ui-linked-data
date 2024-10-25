// TODO: potentially refactor to be 'The folio way'
import { LOCALES } from './locales';

export const BASE_LOCALE = {
  'ld.startEditing': 'Start editing.',
  'ld.dashboard': 'My dashboard',
  'ld.search': 'Search',
  'ld.browse': 'Browse',
  'ld.reset': 'Reset',
  'ld.searchResource': 'Search resources',
  'ld.create': 'Create resource',
  'ld.edit': 'Edit',
  'ld.editResource': 'Edit resource',
  'ld.main': 'Main',
  'ld.and': 'AND',
  'ld.or': 'OR',
  'ld.not': 'NOT',
  'ld.saveRd': 'Save resource',
  'ld.closeRd': 'Close resource',
  'ld.deleteRd': 'Delete resource',
  'ld.noAvailableRds': 'No available resource descriptions.',
  'ld.resources': 'Resources',
  'ld.searchBy': 'Search By',
  'ld.searchFor': 'Search for',
  'ld.searchAndFilter': 'Search & filter',
  'ld.enterSearchCriteria': 'Enter search criteria to start search',
  'ld.chooseFilterOrEnterSearchQuery': 'Choose a filter or enter a search query to show results.',
  'ld.searchNoRdsMatch': 'No resource descriptions match your query',
  'ld.searchBySth': 'Search by{by}...',
  'ld.errorFetching': 'Error fetching data',
  'ld.errorLoadingResource': 'Error loading resource',
  'ld.actions': 'Actions',
  'ld.isbnLccn': 'ISBN/LCCN',
  'ld.isbn': 'ISBN',
  'ld.lccn': 'LCCN',
  'ld.lcnaf': 'LCNAF',
  'ld.title': 'Title', // TODO: it can be "uppercased" programmatically in SearchTypeSelect.tsx, need to be checked
  'ld.contributor': 'Contributor', // TODO: it can be "uppercased" programmatically in SearchTypeSelect.tsx, need to be checked
  'ld.author': 'Author',
  'ld.pubDate': 'Publication Date',
  'ld.pubDateShort': 'Pub Date',
  'ld.edition': 'Edition',
  'ld.select': 'Select',
  'ld.subclass': 'Subclass',
  'ld.heading': 'Heading',
  'ld.selectForEditing': 'Select a resource description for editing',
  'ld.startFromScratch': 'Start from scratch',
  'ld.selectOrStartFromScratch': '{select} or {startFromScratch}',
  'ld.backToTop': 'Back to top',
  'ld.properties': 'Properties',
  'ld.preview': 'Preview',
  'ld.confirmCloseRd': 'Do you really want to close the resource description? All unsaved changes will be lost.',
  'ld.confirmDeleteRd': 'Do you really want to delete the resource description?',
  'ld.saveClose': 'Save and close',
  'ld.close': 'Close',
  'ld.delete': 'Delete',
  'ld.return': 'Return',
  'ld.rdSaveSuccess': 'Resource created. Expect a short delay before resource is visible in FOLIO.',
  'ld.rdUpdateSuccess': 'Resource updated. Expect a short delay before changes are visible in FOLIO.',
  'ld.cantSaveRd': 'Cannot save the resource description',
  'ld.cantDeleteRd': 'Cannot delete the resource description',
  'ld.rdDeleted': 'Resource description deleted',
  'ld.appFail': 'An error occurred. Please, reload the page.',
  'ld.searchSelectIndex': 'Please select an index',
  'ld.searchInvalidLccn': 'LCCN is invalid, please correct',
  'ld.advancedSearch': 'Advanced search',
  'ld.advanced': 'Advanced',
  'ld.cancel': 'Cancel',
  'ld.resourceId': 'Resource ID',
  'ld.loading': 'Loading...',
  'ld.paginationCount': '{startCount} - {endCount} of {totalResultsCount}',
  'ld.yes': 'Yes',
  'ld.no': 'No',
  'ld.cantLoadSimpleLookupData': 'Cannot load data for a simple lookup',
  'ld.publishDate': 'Publish date',
  'ld.format': 'Format',
  'ld.suppressed': 'Suppressed',
  'ld.notSuppressed': 'Not suppressed',
  'ld.volume': 'Volume',
  'ld.ebook': 'eBook',
  'ld.allTime': 'All time',
  'ld.past12Months': 'Past 12 months',
  'ld.past10Yrs': 'Past 10 years',
  'ld.past5Yrs': 'Past 5 years',
  'ld.customRange': 'Custom range',
  'ld.all': 'All',
  'ld.onlineResource': 'Online resource',
  'ld.startsWith': 'Starts with',
  'ld.containsAll': 'Contains all',
  'ld.exactPhrase': 'Exact phrase',
  'ld.publisher': 'Publisher',
  'ld.creator': 'Creator',
  'ld.language': 'Language',
  'ld.classificationNumber': 'Classification number',
  'ld.work': 'Work',
  'ld.instances': 'Instances',
  'ld.noInstancesAvailable': 'No instances available.',
  'ld.noInstancesAdded': 'No instances added',
  'ld.addAnInstance': 'Add an instance',
  'ld.type': 'Type',
  'ld.expandAll': 'Expand all',
  'ld.collapseAll': 'Collapse all',
  'ld.showAllWithCount': 'Show all ({amt})',
  'ld.showAdditionalComponents': 'Show additional components ({amt})',
  'ld.hideAdditionalComponents': 'Hide additional components',
  'ld.hide': 'Hide',
  'ld.saveAndClose': 'Save & close',
  'ld.saveAndContinue': 'Save & continue',
  'ld.editInstance': 'Edit instance',
  'ld.editWork': 'Edit work',
  'ld.createInstance': 'Create instance',
  'ld.createWork': 'Create work',
  'ld.saveAndKeepEditing': 'Save & keep editing',
  'ld.recordMappingToSchema': 'Cannot apply a record to the schema',
  'ld.newResource': 'New resource',
  'ld.addInstance': 'Add instance',
  'ld.compareSelected': 'Compare selected',
  'ld.newInstance': 'New instance',
  'ld.newWork': 'New work',
  'ld.new': 'New',
  'ld.cantSelectReferenceContents': "Can't select reference contents while fetching a reference",
  'ld.addNewInstance': 'Add new instance',
  'ld.askSaveChangesBeforeProceeding': 'Would you like to save your changes before proceeding?',
  'ld.unsavedRecentEdits': 'Recent edits made to the resource have not been saved. Unsaved changes will be lost.',
  'ld.unsavedChanges': 'Unsaved changes',
  'ld.continueWithoutSaving': 'Continue without saving',
  'ld.noTitleInBrackets': '<No title>',
  'ld.viewMarc': 'View MARC',
  'ld.marcWithTitle': 'MARC - {title}',
  'ld.cantLoadMarc': "Can't load MARC for this resource description",
  'ld.duplicate': 'Duplicate',
  'ld.viewLinkedData': 'View linked data',
  'ld.viewInInventory': 'View in Inventory app',
  'ld.authorityType': 'Authority Type',
  'ld.person': 'Person',
  'ld.source': 'Source',
  'ld.family': 'Family',
  'ld.organization': 'Organization',
  'ld.meeting': 'Meeting',
  'ld.corporateBody': 'Corporate body',
  'ld.jurisdiction': 'Jurisdiction',
  'ld.conference': 'Conference',
  'ld.authorizedReference': 'Authorized/Reference',
  'ld.headingReference': 'Heading/Reference',
  'ld.unauthorized': 'Unauthorized',
  'ld.assign': 'Assign',
  'ld.assignAuthority': 'Assign authority',
  'ld.change': 'Change',
  'ld.searchCreatorAuthority': 'Search creator authority',
  'ld.selectMarcAuthority': 'Select MARC authority',
  'ld.marcAuthority': 'MARC authority',
  'ld.keyword': 'Keyword',
  'ld.recordsFound': '{recordsCount} records found',
  'ld.resourceWithIdIsEmpty': 'Resource description {id} is empty',
  'ld.duplicateInstance': 'Duplicate instance',
  'ld.duplicateWork': 'Duplicate work',
  'ld.duplicateInstanceInBrackets': '(DUPLICATE INSTANCE)',
  'ld.duplicateWorkInBrackets': '(DUPLICATE WORK)',
  'ld.identifierAll': 'Identifier (all)',
  'ld.personalName': 'Personal name',
  'ld.corporateName': 'Corporate/Conference name',
  'ld.geographicName': 'Geographic name',
  'ld.nameTitle': 'Name-title',
  'ld.uniformTitle': 'Uniform title',
  'ld.subject': 'Subject',
  'ld.childrensSubjectHeading': "Children's subject heading",
  'ld.genre': 'Genre',
  'ld.authoritySource': 'Authority source',
  'ld.references': 'References',
  'ld.thesaurus': 'Thesaurus',
  'ld.typeOfHeading': 'Type of heading',
  'ld.dateCreated': 'Date created',
  'ld.dateUpdated': 'Date updated',
  'ld.excludeSeeFrom': 'Exclude see from',
  'ld.excludeSeeFromAlso': 'Exclude see from also',
  'ld.previous': 'Previous',
  'ld.next': 'Next',
  'ld.from': 'From',
  'ld.to': 'To',
  'ld.apply': 'Apply',
  'ld.notSpecified': 'Not specified',
  'ld.externalResource': 'External resource',
  'ld.fetchingExternalResourceById': 'Fetching external resource id {resourceId}...',
  'ld.lastUpdated': 'Last updated',
  'ld.marcAuthorityRecord': 'MARC authority record',
  'ld.selectBrowseOption': 'Select a browse option',
  'ld.searchQueryWouldBeHere': '{query} would be here'
};

export const i18nMessages = {
  [LOCALES.ENGLISH]: BASE_LOCALE,
  [LOCALES.GERMAN]: {
    ...BASE_LOCALE,
    'ld.startEditing': 'Bearbeitung starten.',
    'ld.dashboard': 'Mein Armaturenbrett',
    'ld.search': 'Ressourcen durchsuchen',
    'ld.create': 'Ressource erstellen',
    'ld.edit': 'Ressource bearbeiten',
    'ld.main': 'Haupt',
    'ld.saveRd': 'Ressource sparen',
    'ld.closeRd': 'Ressource schließen',
    'ld.deleteRd': 'Ressource löschen',
    'ld.noAvailableRds': 'Keine verfügbaren Ressourcenbeschreibungen.',
    'ld.resources': 'Ressourcen',
    'ld.searchBy': 'Suche nach',
    'ld.searchNoRdsMatch': 'Keine Ressourcenbeschreibungen stimmen mit Ihrer Suchanfrage überein',
    'ld.searchBySth': 'Suche nach{by}...',
    'ld.errorFetching': 'Fehler beim Abrufen der Daten',
    'ld.errorLoadingResource': 'Fehler beim Laden der Ressource',
    'ld.actions': 'Aktionen',
    'ld.isbnLccn': 'ISBN/LCCN',
    'ld.isbn': 'ISBN',
    'ld.lccn': 'LCCN',
    'ld.title': 'Titel', // TODO: it can be "uppercased" programmatically in SearchTypeSelect.tsx, need to be checked
    'ld.contributor': 'Mitwerkender', // TODO: it can be "uppercased" programmatically in SearchTypeSelect.tsx, need to be checked
    'ld.author': 'Autor',
    'ld.pubDate': 'Veröffentlichungsdatum',
    'ld.edition': 'Edition',
    'ld.selectForEditing': 'Wählen Sie eine Ressourcenbeschreibung zur Bearbeitung aus',
    'ld.startFromScratch': 'Von vorne beginnen',
    'ld.selectOrStartFromScratch': '{select} oder {startFromScratch}',
    'ld.backToTop': 'Zurück nach oben',
    'ld.properties': 'Eigenschaften',
    'ld.preview': 'Vorschau',
    'ld.confirmCloseRd':
      'Möchten Sie die Ressourcenbeschreibung wirklich schließen? Alle nicht gespeicherten Änderungen gehen verloren.',
    'ld.confirmDeleteRd': 'Möchten Sie die Ressourcenbeschreibung wirklich löschen?',
    'ld.saveClose': 'Speichern und schließen',
    'ld.close': 'Schließen',
    'ld.delete': 'Löschen',
    'ld.return': 'Zurück',
    'ld.rdSaveSuccess': 'Ressourcenbeschreibung erfolgreich gespeichert',
    'ld.cantSaveRd': 'Die Ressourcenbeschreibung kann nicht gespeichert werden',
    'ld.cantDeleteRd': 'Die Ressourcenbeschreibung kann nicht gelöscht werden',
    'ld.rdDeleted': 'Ressourcenbeschreibung gelöscht',
    'ld.appFail': 'Es ist ein Fehler aufgetreten. Bitte laden Sie die Seite neu.',
    'ld.searchSelectIndex': 'Bitte wählen Sie ein Index',
    'ld.resourceId': 'Ressource ID',
    'ld.loading': 'Wird geladen...',
    'ld.paginationCount': '{startCount} - {endCount} von {totalResultsCount}',
    'ld.yes': 'Ja',
    'ld.no': 'Nein',
    'ld.cantLoadSimpleLookupData': 'Daten können nicht für eine einfache Suche gespeichert werden',
    'ld.recordMappingToSchema': 'Ein Datensatz kann nicht auf das Schema angewendet werden',
    'ld.newResource': 'Neue Ressource',
    'ld.compareSelected': 'Ausgewählte vergleichen',
  },
  [LOCALES.JAPANESE]: {
    ...BASE_LOCALE,
  },
  [LOCALES.FRENCH]: {
    ...BASE_LOCALE,
  },
};
