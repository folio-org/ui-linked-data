export const Profile = [
  {
    "uuid": "ade54fa5-c456-4884-9996-241c913d1e6d",
    "type": "profile",
    "path": ["ade54fa5-c456-4884-9996-241c913d1e6d"],
    "displayName": "BIBFRAME 2.0 Monograph",
    "bfid": "lc:profile:bf2:Monograph",
    "children": [
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "17d2875b-f164-4de9-9597-59012a58320d",
      "ff17d38e-a9a5-4d52-8d87-2f564148b024",
      "5e5533bc-3b68-4f46-8ce3-52da2e8257bd"
    ],
    "htmlId": "Monograph::0"
  },
  {
    "uuid": "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
    "type": "block",
    "path": ["ade54fa5-c456-4884-9996-241c913d1e6d", "dfcd5049-ace6-4e8c-9405-d83128dfa6cb"],
    "displayName": "BIBFRAME Work",
    "bfid": "lc:RT:bf2:Monograph:Work",
    "uri": "http://id.loc.gov/ontologies/bibframe/Work",
    "uriBFLite": "http://bibfra.me/vocab/lite/Work",
    "children": [
      "4f06d90b-bc8e-4246-8614-88057a9305dc",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "56c87f70-a047-415e-9db6-dd58442ca855",
      "ecd707fb-13c5-454f-ade4-54db8e75c066",
      "953774d0-7ffc-4368-855c-262b8a71b93d",
      "bc74731e-e30f-478d-aa64-cc673d489236",
      "6acf9f3a-7de9-4efd-b51c-d90a1c469a81",
      "e3fe0699-0432-4564-bcf6-6ffbc0e896c4",
      "db605822-bf0b-4162-a517-5414aa2252f4",
      "7d9ae903-74c7-4d84-b799-ff6271ecce88",
      "ae405b9d-57dd-4d50-93cc-31b0cfc0af08",
      "9cc073dd-7c9f-470d-b4d3-ae1b5d1afa1b",
      "9fce2e4c-c16a-4ba8-b313-19ce2b9f47ff",
      "5ae8ebb0-ea06-42e5-8377-f0a5c11543b2",
      "2d5f32f0-005f-4313-b1e0-7fa13fd9d50a",
      '0c3d8d8d-a561-4750-a743-856a05c0d13e'
      // "8e1f9732-1e16-4034-b060-b4c66a8c23b9"
    ],
    "htmlId": "Monograph::0__Work::0",
    "twinChildren": {
      "http://id.loc.gov/ontologies/bibframe/classification": [
        "9fce2e4c-c16a-4ba8-b313-19ce2b9f47ff",
        "5ae8ebb0-ea06-42e5-8377-f0a5c11543b2"
      ]
    }
  },
  {
    "uuid": "4f06d90b-bc8e-4246-8614-88057a9305dc",
    "type": "group",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "4f06d90b-bc8e-4246-8614-88057a9305dc"
    ],
    "displayName": "Creator of Work",
    "uri": "http://id.loc.gov/ontologies/bibframe/contribution",
    "uriBFLite": "http://bibfra.me/vocab/lite/creator",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bflc/PrimaryContribution"
      }
    },
    "children": [
      "56d99650-7d15-48fa-aa27-72b6712ca6f3",
      "bdfe14bb-0080-4ae9-ab04-c198f53a611f",
      "dff3319a-104d-4289-bf34-2b74c67633df"
    ],
    "htmlId": "Monograph::0__Work::0__creator::0"
  },
  {
    "bfid": "lc:RT:bf2:search:name",
    "uuid": "56d99650-7d15-48fa-aa27-72b6712ca6f3",
    "type": "complex",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "4f06d90b-bc8e-4246-8614-88057a9305dc",
      "56d99650-7d15-48fa-aa27-72b6712ca6f3"
    ],
    "displayName": "Name",
    "uri": "http://www.w3.org/2002/07/owl#sameAs",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://preprod.id.loc.gov/authorities/names"],
      "valueDataType": {}
    },
    "layout": {
      "api": "authorities",
      "isNew": true,
      "baseLabelType": "creator"
    },
    "linkedEntry": { "dependent": "bdfe14bb-0080-4ae9-ab04-c198f53a611f" },
    "htmlId": "Monograph::0__Work::0__creator::0__creator$$v2::0__owl#sameAs$$name::0"
  },
  {
    "uuid": "bdfe14bb-0080-4ae9-ab04-c198f53a611f_empty",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "4f06d90b-bc8e-4246-8614-88057a9305dc",
      "9b41e7a3-01e8-4ca1-a073-ed82509ef527",
      "bdfe14bb-0080-4ae9-ab04-c198f53a611f",
      "bdfe14bb-0080-4ae9-ab04-c198f53a611f_empty"
    ],
    "displayName": "",
    "bfid": "",
    "uri": "",
    "uriBFLite": "",
    "children": []
  },
  {
    "uuid": "bdfe14bb-0080-4ae9-ab04-c198f53a611f",
    "type": "dropdown",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "4f06d90b-bc8e-4246-8614-88057a9305dc",
      "9b41e7a3-01e8-4ca1-a073-ed82509ef527",
      "bdfe14bb-0080-4ae9-ab04-c198f53a611f"
    ],
    "displayName": "Subclass",
    "uri": "http://id.loc.gov/ontologies/bibframe/agent",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bflc/PrimaryContribution"
      }
    },
    "children": [
      "bdfe14bb-0080-4ae9-ab04-c198f53a611f_empty",
      "3697eaa3-af9d-43ea-bc29-a4fc083d90a2",
      "01373a1f-f8a9-46b9-b3a5-a0a94fbd6da8",
      "0b723982-ff76-4636-99b2-cb5d42a87d9f",
      "78a8d284-cc4c-417e-a300-30f9c558261b",
      "30b67a19-bba4-421c-a013-19df8c0dfab4"
    ],
    "layout": { "readOnly": true },
    "dependsOn": "lc:RT:bf2:search:name",
    "linkedEntry": { "controlledBy": "56d99650-7d15-48fa-aa27-72b6712ca6f3" },
    "htmlId": "Monograph::0__Work::0__creator::0__creator$$v2::0__agent::0"
  },
  {
    "uuid": "3697eaa3-af9d-43ea-bc29-a4fc083d90a2",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "4f06d90b-bc8e-4246-8614-88057a9305dc",
      "9b41e7a3-01e8-4ca1-a073-ed82509ef527",
      "bdfe14bb-0080-4ae9-ab04-c198f53a611f",
      "3697eaa3-af9d-43ea-bc29-a4fc083d90a2"
    ],
    "displayName": "Person",
    "bfid": "lc:RT:bf2:Agent:bfPerson:v2",
    "uri": "http://id.loc.gov/ontologies/bibframe/Person",
    "uriBFLite": "http://bibfra.me/vocab/lite/Person",
    "children": [],
    "htmlId": "Monograph::0__Work::0__creator::0__creator$$v2::0__agent::0__Person$$v2::0"
  },
  {
    "uuid": "01373a1f-f8a9-46b9-b3a5-a0a94fbd6da8",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "4f06d90b-bc8e-4246-8614-88057a9305dc",
      "9b41e7a3-01e8-4ca1-a073-ed82509ef527",
      "bdfe14bb-0080-4ae9-ab04-c198f53a611f",
      "01373a1f-f8a9-46b9-b3a5-a0a94fbd6da8"
    ],
    "displayName": "Family",
    "bfid": "lc:RT:bf2:Agent:bfFamily:v2",
    "uri": "http://id.loc.gov/ontologies/bibframe/Family",
    "uriBFLite": "http://bibfra.me/vocab/lite/Family",
    "children": [],
    "htmlId": "Monograph::0__Work::0__creator::0__creator$$v2::0__agent::0__Family$$v2::0"
  },
  {
    "uuid": "0b723982-ff76-4636-99b2-cb5d42a87d9f",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "4f06d90b-bc8e-4246-8614-88057a9305dc",
      "9b41e7a3-01e8-4ca1-a073-ed82509ef527",
      "bdfe14bb-0080-4ae9-ab04-c198f53a611f",
      "0b723982-ff76-4636-99b2-cb5d42a87d9f"
    ],
    "displayName": "Corporate Body",
    "bfid": "lc:RT:bf2:Agent:bfCorp:v2",
    "uri": "http://id.loc.gov/ontologies/bibframe/Organization",
    "uriBFLite": "http://bibfra.me/vocab/lite/Organization",
    "children": [],
    "htmlId": "Monograph::0__Work::0__creator::0__creator$$v2::0__agent::0__Organization$$v2::0"
  },
  {
    "uuid": "78a8d284-cc4c-417e-a300-30f9c558261b",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "4f06d90b-bc8e-4246-8614-88057a9305dc",
      "9b41e7a3-01e8-4ca1-a073-ed82509ef527",
      "bdfe14bb-0080-4ae9-ab04-c198f53a611f",
      "78a8d284-cc4c-417e-a300-30f9c558261b"
    ],
    "displayName": "Jurisdiction",
    "bfid": "lc:RT:bf2:Agent:bfJurisdiction:v2",
    "uri": "http://id.loc.gov/ontologies/bibframe/Jurisdiction",
    "uriBFLite": "http://bibfra.me/vocab/lite/Jurisdiction",
    "children": [],
    "htmlId": "Monograph::0__Work::0__creator::0__creator$$v2::0__agent::0__Jurisdiction$$v2::0"
  },
  {
    "uuid": "30b67a19-bba4-421c-a013-19df8c0dfab4",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "4f06d90b-bc8e-4246-8614-88057a9305dc",
      "9b41e7a3-01e8-4ca1-a073-ed82509ef527",
      "bdfe14bb-0080-4ae9-ab04-c198f53a611f",
      "30b67a19-bba4-421c-a013-19df8c0dfab4"
    ],
    "displayName": "Conference",
    "bfid": "lc:RT:bf2:Agent:bfConf:v2",
    "uri": "http://id.loc.gov/ontologies/bibframe/Meeting",
    "uriBFLite": "http://bibfra.me/vocab/lite/Meeting",
    "children": [],
    "htmlId": "Monograph::0__Work::0__creator::0__creator$$v2::0__agent::0__Meeting$$v2::0"
  },
  {
    "uuid": "dff3319a-104d-4289-bf34-2b74c67633df",
    "type": "simple",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "4f06d90b-bc8e-4246-8614-88057a9305dc",
      "9b41e7a3-01e8-4ca1-a073-ed82509ef527",
      "dff3319a-104d-4289-bf34-2b74c67633df"
    ],
    "displayName": "Relationship",
    "uri": "http://id.loc.gov/ontologies/bibframe/role",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/relators", "https://id.loc.gov/vocabulary/rbmsrel"],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Role"
      }
    },
    "htmlId": "Monograph::0__Work::0__creator::0__creator$$v2::0__role::0"
  },
  {
    "uuid": "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
    "type": "dropdown",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292"
    ],
    "displayName": "Title Information",
    "uri": "http://id.loc.gov/ontologies/bibframe/title",
    "uriBFLite": "http://bibfra.me/vocab/marc/title",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "children": [
      "737a5245-ea60-4694-825d-8e3e64cca3e4",
      "3139661d-eff3-4a32-b156-883591ca6f6c",
      "114ab6d5-9ba9-40ef-9f60-4998a4595752"
    ],
    "htmlId": "Monograph::0__Work::0__title::0"
  },
  {
    "uuid": "737a5245-ea60-4694-825d-8e3e64cca3e4",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "737a5245-ea60-4694-825d-8e3e64cca3e4"
    ],
    "displayName": "Work Title",
    "bfid": "lc:RT:bf2:WorkTitle",
    "uri": "http://id.loc.gov/ontologies/bibframe/Title",
    "uriBFLite": "http://bibfra.me/vocab/marc/Title",
    "children": [
      "938b90f6-9297-49fa-aa37-69f52b9a7bef",
      "a6733cd0-95b1-41de-8b5a-6282eef63584",
      "c1a3b7ab-96dd-497d-a118-455c3b1ef34c",
      "30a1073b-43e3-4e93-8b3c-2a1c5256aa51"
    ],
    "htmlId": "Monograph::0__Work::0__title::0__Title$$WorkTitle::0"
  },
  {
    "uuid": "938b90f6-9297-49fa-aa37-69f52b9a7bef",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "737a5245-ea60-4694-825d-8e3e64cca3e4",
      "938b90f6-9297-49fa-aa37-69f52b9a7bef"
    ],
    "displayName": "Non-sort character count",
    "uri": "http://id.loc.gov/ontologies/bflc/nonSortNum",
    "uriBFLite": "http://bibfra.me/vocab/bflc/nonSortNum",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__title::0__Title$$WorkTitle::0__nonSortNum::0"
  },
  {
    "uuid": "a6733cd0-95b1-41de-8b5a-6282eef63584",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "737a5245-ea60-4694-825d-8e3e64cca3e4",
      "a6733cd0-95b1-41de-8b5a-6282eef63584"
    ],
    "displayName": "Preferred Title for Work",
    "uri": "http://id.loc.gov/ontologies/bibframe/mainTitle",
    "uriBFLite": "http://bibfra.me/vocab/marc/mainTitle",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": { "dataTypeURI": "" }
    },
    "htmlId": "Monograph::0__Work::0__title::0__Title$$WorkTitle::0__mainTitle::0"
  },
  {
    "uuid": "c1a3b7ab-96dd-497d-a118-455c3b1ef34c",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "737a5245-ea60-4694-825d-8e3e64cca3e4",
      "c1a3b7ab-96dd-497d-a118-455c3b1ef34c"
    ],
    "displayName": "Part number",
    "uri": "http://id.loc.gov/ontologies/bibframe/partNumber",
    "uriBFLite": "http://bibfra.me/vocab/marc/partNumber",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__title::0__Title$$WorkTitle::0__partNumber::0"
  },
  {
    "uuid": "30a1073b-43e3-4e93-8b3c-2a1c5256aa51",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "737a5245-ea60-4694-825d-8e3e64cca3e4",
      "30a1073b-43e3-4e93-8b3c-2a1c5256aa51"
    ],
    "displayName": "Part name",
    "uri": "http://id.loc.gov/ontologies/bibframe/partName",
    "uriBFLite": "http://bibfra.me/vocab/marc/partName",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__title::0__Title$$WorkTitle::0__partName::0"
  },
  {
    "uuid": "3139661d-eff3-4a32-b156-883591ca6f6c",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "3139661d-eff3-4a32-b156-883591ca6f6c"
    ],
    "displayName": "Variant Title",
    "bfid": "lc:RT:bf2:Title:VarTitle",
    "uri": "http://id.loc.gov/ontologies/bibframe/VariantTitle",
    "uriBFLite": "http://bibfra.me/vocab/marc/VariantTitle",
    "children": [
      "54fc6650-79fe-4a90-a528-81315ef9ef8b",
      "57fc2aa2-8d46-455e-a948-76e030e232f4",
      "6f8f3839-319a-44bc-bd4e-aaead67b9074",
      "ef60dfc5-bb66-4f63-8ab2-c6f3dee69101",
      "0403267d-6bb1-482c-816f-e3f87daeaa1e",
      "75ebd009-fa99-4620-9776-779316c9439c",
      "97edcf84-f37b-4778-b8d1-0a8f21690e2d"
    ],
    "htmlId": "Monograph::0__Work::0__title::0__VariantTitle$$VarTitle::0"
  },
  {
    "uuid": "54fc6650-79fe-4a90-a528-81315ef9ef8b",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "3139661d-eff3-4a32-b156-883591ca6f6c",
      "54fc6650-79fe-4a90-a528-81315ef9ef8b"
    ],
    "displayName": "Variant Title",
    "uri": "http://id.loc.gov/ontologies/bibframe/mainTitle",
    "uriBFLite": "http://bibfra.me/vocab/marc/mainTitle",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__title::0__VariantTitle$$VarTitle::0__mainTitle::0"
  },
  {
    "uuid": "57fc2aa2-8d46-455e-a948-76e030e232f4",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "3139661d-eff3-4a32-b156-883591ca6f6c",
      "57fc2aa2-8d46-455e-a948-76e030e232f4"
    ],
    "displayName": "Part number",
    "uri": "http://id.loc.gov/ontologies/bibframe/partNumber",
    "uriBFLite": "http://bibfra.me/vocab/marc/partNumber",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__title::0__VariantTitle$$VarTitle::0__partNumber::0"
  },
  {
    "uuid": "6f8f3839-319a-44bc-bd4e-aaead67b9074",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "3139661d-eff3-4a32-b156-883591ca6f6c",
      "6f8f3839-319a-44bc-bd4e-aaead67b9074"
    ],
    "displayName": "Part name",
    "uri": "http://id.loc.gov/ontologies/bibframe/partName",
    "uriBFLite": "http://bibfra.me/vocab/marc/partName",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__title::0__VariantTitle$$VarTitle::0__partName::0"
  },
  {
    "uuid": "ef60dfc5-bb66-4f63-8ab2-c6f3dee69101",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "3139661d-eff3-4a32-b156-883591ca6f6c",
      "ef60dfc5-bb66-4f63-8ab2-c6f3dee69101"
    ],
    "displayName": "Other title information",
    "uri": "http://id.loc.gov/ontologies/bibframe/subtitle",
    "uriBFLite": "http://bibfra.me/vocab/marc/subTitle",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__title::0__VariantTitle$$VarTitle::0__subTitle::0"
  },
  {
    "uuid": "0403267d-6bb1-482c-816f-e3f87daeaa1e",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "3139661d-eff3-4a32-b156-883591ca6f6c",
      "0403267d-6bb1-482c-816f-e3f87daeaa1e"
    ],
    "displayName": "Date",
    "uri": "http://id.loc.gov/ontologies/bibframe/date",
    "uriBFLite": "http://bibfra.me/vocab/lite/date",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__title::0__VariantTitle$$VarTitle::0__date::0"
  },
  {
    "uuid": "75ebd009-fa99-4620-9776-779316c9439c",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "3139661d-eff3-4a32-b156-883591ca6f6c",
      "75ebd009-fa99-4620-9776-779316c9439c"
    ],
    "displayName": "Variant title type",
    "uri": "http://id.loc.gov/ontologies/bibframe/variantType",
    "uriBFLite": "http://bibfra.me/vocab/marc/variantType",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__title::0__VariantTitle$$VarTitle::0__variantType::0"
  },
  {
    "uuid": "97edcf84-f37b-4778-b8d1-0a8f21690e2d",
    "type": "group",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "3139661d-eff3-4a32-b156-883591ca6f6c",
      "97edcf84-f37b-4778-b8d1-0a8f21690e2d"
    ],
    "displayName": "Note",
    "uri": "http://id.loc.gov/ontologies/bibframe/note",
    "uriBFLite": "http://bibfra.me/vocab/lite/note",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "children": ["d4a60529-fb0b-4496-95b1-30712bb634ff"],
    "htmlId": "Monograph::0__Work::0__title::0__VariantTitle$$VarTitle::0__note::0"
  },
  {
    "uuid": "d4a60529-fb0b-4496-95b1-30712bb634ff",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "3139661d-eff3-4a32-b156-883591ca6f6c",
      "97edcf84-f37b-4778-b8d1-0a8f21690e2d",
      "d4a60529-fb0b-4496-95b1-30712bb634ff"
    ],
    "displayName": "Note",
    "uri": "http://www.w3.org/2000/01/rdf-schema#label",
    "uriBFLite": "http://bibfra.me/vocab/lite/note",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__title::0__VariantTitle$$VarTitle::0__note::0__Note$$NoteSimple::0__note::0"
  },
  {
    "uuid": "114ab6d5-9ba9-40ef-9f60-4998a4595752",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "114ab6d5-9ba9-40ef-9f60-4998a4595752"
    ],
    "displayName": "Parallel Title",
    "bfid": "lc:RT:bf2:ParallelTitle",
    "uri": "http://id.loc.gov/ontologies/bibframe/ParallelTitle",
    "uriBFLite": "http://bibfra.me/vocab/marc/ParallelTitle",
    "children": [
      "f0bf7bac-a474-4559-b7e3-e0071fc2fb27",
      "f39eb41c-f437-40cf-bc7a-e0473df9b5be",
      "0a3514f5-480a-4c3e-a17d-249a5415f5c1",
      "86e89033-5e16-4c59-bad2-ab742ac2a2f4",
      "c93417e8-fba7-4e61-9b76-ba147b94ad6d",
      "eebafa12-7505-4cb4-bc59-7d570e07561b"
    ],
    "htmlId": "Monograph::0__Work::0__title::0__ParallelTitle::0"
  },
  {
    "uuid": "f0bf7bac-a474-4559-b7e3-e0071fc2fb27",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "114ab6d5-9ba9-40ef-9f60-4998a4595752",
      "f0bf7bac-a474-4559-b7e3-e0071fc2fb27"
    ],
    "displayName": "Parallel Title",
    "uri": "http://id.loc.gov/ontologies/bibframe/mainTitle",
    "uriBFLite": "http://bibfra.me/vocab/marc/mainTitle",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__title::0__ParallelTitle::0__mainTitle::0"
  },
  {
    "uuid": "f39eb41c-f437-40cf-bc7a-e0473df9b5be",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "114ab6d5-9ba9-40ef-9f60-4998a4595752",
      "f39eb41c-f437-40cf-bc7a-e0473df9b5be"
    ],
    "displayName": "Other Title Information",
    "uri": "http://id.loc.gov/ontologies/bibframe/subtitle",
    "uriBFLite": "http://bibfra.me/vocab/marc/subTitle",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__title::0__ParallelTitle::0__subTitle::0"
  },
  {
    "uuid": "0a3514f5-480a-4c3e-a17d-249a5415f5c1",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "114ab6d5-9ba9-40ef-9f60-4998a4595752",
      "0a3514f5-480a-4c3e-a17d-249a5415f5c1"
    ],
    "displayName": "Part number",
    "uri": "http://id.loc.gov/ontologies/bibframe/partNumber",
    "uriBFLite": "http://bibfra.me/vocab/marc/partNumber",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__title::0__ParallelTitle::0__partNumber::0"
  },
  {
    "uuid": "86e89033-5e16-4c59-bad2-ab742ac2a2f4",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "114ab6d5-9ba9-40ef-9f60-4998a4595752",
      "86e89033-5e16-4c59-bad2-ab742ac2a2f4"
    ],
    "displayName": "Part name",
    "uri": "http://id.loc.gov/ontologies/bibframe/partName",
    "uriBFLite": "http://bibfra.me/vocab/marc/partName",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__title::0__ParallelTitle::0__partName::0"
  },
  {
    "uuid": "c93417e8-fba7-4e61-9b76-ba147b94ad6d",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "114ab6d5-9ba9-40ef-9f60-4998a4595752",
      "c93417e8-fba7-4e61-9b76-ba147b94ad6d"
    ],
    "displayName": "Date",
    "uri": "http://id.loc.gov/ontologies/bibframe/date",
    "uriBFLite": "http://bibfra.me/vocab/lite/date",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__title::0__ParallelTitle::0__date::0"
  },
  {
    "uuid": "eebafa12-7505-4cb4-bc59-7d570e07561b",
    "type": "group",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "114ab6d5-9ba9-40ef-9f60-4998a4595752",
      "eebafa12-7505-4cb4-bc59-7d570e07561b"
    ],
    "displayName": "Note",
    "uri": "http://id.loc.gov/ontologies/bibframe/note",
    "uriBFLite": "http://bibfra.me/vocab/lite/note",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "children": ["5c8238b5-318c-4c1c-9538-b46de0c5ce0b"],
    "htmlId": "Monograph::0__Work::0__title::0__ParallelTitle::0__note::0"
  },
  {
    "uuid": "5c8238b5-318c-4c1c-9538-b46de0c5ce0b",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5a3e9d80-d6d1-4e2c-9cae-0d8da58ab292",
      "114ab6d5-9ba9-40ef-9f60-4998a4595752",
      "eebafa12-7505-4cb4-bc59-7d570e07561b",
      "5c8238b5-318c-4c1c-9538-b46de0c5ce0b"
    ],
    "displayName": "Note",
    "uri": "http://www.w3.org/2000/01/rdf-schema#label",
    "uriBFLite": "http://bibfra.me/vocab/lite/note",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__title::0__ParallelTitle::0__note::0__Note$$NoteSimple::0__note::0"
  },
  {
    "uuid": "56c87f70-a047-415e-9db6-dd58442ca855",
    "type": "simple",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "56c87f70-a047-415e-9db6-dd58442ca855"
    ],
    "displayName": "Government publication",
    "uri": "http://id.loc.gov/ontologies/bflc/governmentPubType",
    "uriBFLite": "http://bibfra.me/vocab/marc/governmentPublication",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/mgovtpubtype"],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bflc/GovernmentPubType"
      }
    },
    "htmlId": "Monograph::0__Work::0__governmentPublication::0"
  },
  {
    "uuid": "ecd707fb-13c5-454f-ade4-54db8e75c066",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "ecd707fb-13c5-454f-ade4-54db8e75c066"
    ],
    "displayName": "Date of Work",
    "uri": "http://id.loc.gov/ontologies/bibframe/originDate",
    "uriBFLite": "http://bibfra.me/vocab/lite/dateStart",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__dateStart::0"
  },
  {
    "uuid": "953774d0-7ffc-4368-855c-262b8a71b93d",
    "type": "simple",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "953774d0-7ffc-4368-855c-262b8a71b93d"
    ],
    "displayName": "Place of Origin of the Work",
    "uri": "http://id.loc.gov/ontologies/bibframe/originPlace",
    "uriBFLite": "http://bibfra.me/vocab/marc/originPlace",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/countries"],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Place"
      }
    },
    "htmlId": "Monograph::0__Work::0__originPlace::0"
  },
  {
    "uuid": "bc74731e-e30f-478d-aa64-cc673d489236",
    "type": "group",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "bc74731e-e30f-478d-aa64-cc673d489236"
    ],
    "displayName": "Geographic Coverage",
    "uri": "http://id.loc.gov/ontologies/bibframe/geographicCoverage",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "children": ["e7d339f4-4291-4bd9-944b-5870b10cbc59"],
    "htmlId": "Monograph::0__Work::0__geographicCoverage::0"
  },
  {
    "uuid": "e7d339f4-4291-4bd9-944b-5870b10cbc59",
    "type": "complex",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "bc74731e-e30f-478d-aa64-cc673d489236",
      "e7d339f4-4291-4bd9-944b-5870b10cbc59"
    ],
    "displayName": "Search LCNAF, LCSH or GAC",
    "uri": "http://www.w3.org/2002/07/owl#sameAs",
    "uriBFLite": "_geographicCoverageReference",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/authorities/geographics"],
      "valueDataType": { "remark": "", "dataTypeURI": "" }
    },
    "htmlId": "Monograph::0__Work::0__geographicCoverage::0__GeographicCoverage$$Geog::0___geographicCoverageReference::0"
  },
  {
    "uuid": "6acf9f3a-7de9-4efd-b51c-d90a1c469a81",
    "type": "simple",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "6acf9f3a-7de9-4efd-b51c-d90a1c469a81"
    ],
    "displayName": "Intended Audience",
    "uri": "http://id.loc.gov/ontologies/bibframe/intendedAudience",
    "uriBFLite": "http://bibfra.me/vocab/marc/targetAudience",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/maudience"],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/IntendedAudience"
      }
    },
    "htmlId": "Monograph::0__Work::0__targetAudience::0"
  },
  {
    "uuid": "e3fe0699-0432-4564-bcf6-6ffbc0e896c4",
    "type": "group",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "e3fe0699-0432-4564-bcf6-6ffbc0e896c4"
    ],
    "displayName": "Other contributors",
    "uri": "http://id.loc.gov/ontologies/bibframe/contribution",
    "uriBFLite": "http://bibfra.me/vocab/lite/contributor",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Contribution"
      }
    },
    "children": [
      "088d929a-66b2-4da5-9f97-2100993b3a3d",
      "e85b0fae-302e-4acf-a19f-e762782927c3",
      "739b262d-41c7-43f8-87ff-432c89cc538f"
    ],
    "htmlId": "Monograph::0__Work::0__contributor::0"
  },
  {
    "bfid": "lc:RT:bf2:search:name",
    "uuid": "088d929a-66b2-4da5-9f97-2100993b3a3d",
    "type": "complex",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "e3fe0699-0432-4564-bcf6-6ffbc0e896c4",
      "088d929a-66b2-4da5-9f97-2100993b3a3d"
    ],
    "displayName": "Name",
    "uri": "http://www.w3.org/2002/07/owl#sameAs",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://preprod.id.loc.gov/authorities/names"],
      "valueDataType": {}
    },
    "layout": {
      "api": "authorities",
      "isNew": true,
      "baseLabelType": "contributor"
    },
    "linkedEntry": { "dependent": "e85b0fae-302e-4acf-a19f-e762782927c3" },
    "htmlId": "Monograph::0__Work::0__contributor::0__contributor$$v2::0__owl#sameAs$$name::0"
  },
  {
    "uuid": "e85b0fae-302e-4acf-a19f-e762782927c3_empty",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "e3fe0699-0432-4564-bcf6-6ffbc0e896c4",
      "e85b0fae-302e-4acf-a19f-e762782927c3",
      "e85b0fae-302e-4acf-a19f-e762782927c3_empty"
    ],
    "displayName": "",
    "bfid": "",
    "uri": "",
    "uriBFLite": "",
    "children": []
  },
  {
    "uuid": "e85b0fae-302e-4acf-a19f-e762782927c3",
    "type": "dropdown",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "e3fe0699-0432-4564-bcf6-6ffbc0e896c4",
      "e85b0fae-302e-4acf-a19f-e762782927c3"
    ],
    "displayName": "Subclass",
    "uri": "http://id.loc.gov/ontologies/bibframe/agent",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": []
    },
    "children": [
      "e85b0fae-302e-4acf-a19f-e762782927c3_empty",
      "97881309-0720-4f50-aeb9-b2870f8dfcc3",
      "d7acc518-49cc-491b-8a43-8229e04b7a6b",
      "57310e99-6ea0-4c7d-9bd8-82e99e2e1936",
      "5407c7ac-7366-4bf8-80ed-ff89e88dcbd3",
      "5789929f-64b4-4f55-bc15-157fd3405b19"
    ],
    "layout": { "readOnly": true },
    "dependsOn": "lc:RT:bf2:search:name",
    "linkedEntry": { "controlledBy": "088d929a-66b2-4da5-9f97-2100993b3a3d" },
    "htmlId": "Monograph::0__Work::0__contributor::0__contributor$$v2::0__agent::0"
  },
  {
    "uuid": "97881309-0720-4f50-aeb9-b2870f8dfcc3",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "e3fe0699-0432-4564-bcf6-6ffbc0e896c4",
      "e85b0fae-302e-4acf-a19f-e762782927c3",
      "97881309-0720-4f50-aeb9-b2870f8dfcc3"
    ],
    "displayName": "Person",
    "bfid": "lc:RT:bf2:Agent:bfPerson:v2",
    "uri": "http://id.loc.gov/ontologies/bibframe/Person",
    "uriBFLite": "http://bibfra.me/vocab/lite/Person",
    "children": [],
    "htmlId": "Monograph::0__Work::0__contributor::0__contributor$$v2::0__agent::0__Person$$v2::0"
  },
  {
    "uuid": "d7acc518-49cc-491b-8a43-8229e04b7a6b",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "e3fe0699-0432-4564-bcf6-6ffbc0e896c4",
      "e85b0fae-302e-4acf-a19f-e762782927c3",
      "d7acc518-49cc-491b-8a43-8229e04b7a6b"
    ],
    "displayName": "Family",
    "bfid": "lc:RT:bf2:Agent:bfFamily:v2",
    "uri": "http://id.loc.gov/ontologies/bibframe/Family",
    "uriBFLite": "http://bibfra.me/vocab/lite/Family",
    "children": [],
    "htmlId": "Monograph::0__Work::0__contributor::0__contributor$$v2::0__agent::0__Family$$v2::0"
  },
  {
    "uuid": "57310e99-6ea0-4c7d-9bd8-82e99e2e1936",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "e3fe0699-0432-4564-bcf6-6ffbc0e896c4",
      "e85b0fae-302e-4acf-a19f-e762782927c3",
      "57310e99-6ea0-4c7d-9bd8-82e99e2e1936"
    ],
    "displayName": "Corporate Body",
    "bfid": "lc:RT:bf2:Agent:bfCorp:v2",
    "uri": "http://id.loc.gov/ontologies/bibframe/Organization",
    "uriBFLite": "http://bibfra.me/vocab/lite/Organization",
    "children": [],
    "htmlId": "Monograph::0__Work::0__contributor::0__contributor$$v2::0__agent::0__Organization$$v2::0"
  },
  {
    "uuid": "5407c7ac-7366-4bf8-80ed-ff89e88dcbd3",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "e3fe0699-0432-4564-bcf6-6ffbc0e896c4",
      "e85b0fae-302e-4acf-a19f-e762782927c3",
      "5407c7ac-7366-4bf8-80ed-ff89e88dcbd3"
    ],
    "displayName": "Jurisdiction",
    "bfid": "lc:RT:bf2:Agent:bfJurisdiction:v2",
    "uri": "http://id.loc.gov/ontologies/bibframe/Jurisdiction",
    "uriBFLite": "http://bibfra.me/vocab/lite/Jurisdiction",
    "children": [],
    "htmlId": "Monograph::0__Work::0__contributor::0__contributor$$v2::0__agent::0__Jurisdiction$$v2::0"
  },
  {
    "uuid": "5789929f-64b4-4f55-bc15-157fd3405b19",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "e3fe0699-0432-4564-bcf6-6ffbc0e896c4",
      "e85b0fae-302e-4acf-a19f-e762782927c3",
      "5789929f-64b4-4f55-bc15-157fd3405b19"
    ],
    "displayName": "Conference",
    "bfid": "lc:RT:bf2:Agent:bfConf:v2",
    "uri": "http://id.loc.gov/ontologies/bibframe/Meeting",
    "uriBFLite": "http://bibfra.me/vocab/lite/Meeting",
    "children": [],
    "htmlId": "Monograph::0__Work::0__contributor::0__contributor$$v2::0__agent::0__Meeting$$v2::0"
  },
  {
    "uuid": "739b262d-41c7-43f8-87ff-432c89cc538f",
    "type": "simple",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "e3fe0699-0432-4564-bcf6-6ffbc0e896c4",
      "739b262d-41c7-43f8-87ff-432c89cc538f"
    ],
    "displayName": "Relationship",
    "uri": "http://id.loc.gov/ontologies/bibframe/role",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/relators", "https://id.loc.gov/vocabulary/rbmsrel"]
    },
    "htmlId": "Monograph::0__Work::0__contributor::0__contributor$$v2::0__role::0"
  },
  {
    "uuid": "db605822-bf0b-4162-a517-5414aa2252f4",
    "type": "group",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "db605822-bf0b-4162-a517-5414aa2252f4"
    ],
    "displayName": "Notes about the Work",
    "uri": "http://id.loc.gov/ontologies/bibframe/note",
    "uriBFLite": "_notes",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "children": ["dce2d0b7-d868-48bd-8d9c-60600ce987e7", "83eccfbd-4be8-464d-8ba9-958ea17de54a"],
    "htmlId": "Monograph::0__Work::0__note::0"
  },
  {
    "uuid": "dce2d0b7-d868-48bd-8d9c-60600ce987e7",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "db605822-bf0b-4162-a517-5414aa2252f4",
      "dce2d0b7-d868-48bd-8d9c-60600ce987e7"
    ],
    "displayName": "Note",
    "uri": "http://www.w3.org/2000/01/rdf-schema#label",
    "uriBFLite": "value",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__note::0__Note::0__note::0"
  },
  {
    "uuid": "83eccfbd-4be8-464d-8ba9-958ea17de54a",
    "type": "simple",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "db605822-bf0b-4162-a517-5414aa2252f4",
      "83eccfbd-4be8-464d-8ba9-958ea17de54a"
    ],
    "displayName": "Note type",
    "uri": "http://id.loc.gov/ontologies/bibframe/noteType",
    "uriBFLite": "type",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/mnotetype"],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__note::0__Note::0__noteType::0"
  },
  {
    "uuid": "7d9ae903-74c7-4d84-b799-ff6271ecce88",
    "type": "group",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "7d9ae903-74c7-4d84-b799-ff6271ecce88"
    ],
    "displayName": "Contents",
    "uri": "http://id.loc.gov/ontologies/bibframe/tableOfContents",
    "uriBFLite": "_notes",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "children": ["7d4072b8-497d-48fa-bbe7-b8343802637a"],
    "htmlId": "Monograph::0__Work::0__tableOfContents::0"
  },
  {
    "uuid": "7d4072b8-497d-48fa-bbe7-b8343802637a",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "7d9ae903-74c7-4d84-b799-ff6271ecce88",
      "7d4072b8-497d-48fa-bbe7-b8343802637a"
    ],
    "displayName": "Contents note",
    "uri": "http://www.w3.org/2000/01/rdf-schema#label",
    "uriBFLite": "http://bibfra.me/vocab/marc/tableOfContents",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__tableOfContents::0__TableOfContents$$Contents::0__tableOfContents::0"
  },
  {
    "uuid": "ae405b9d-57dd-4d50-93cc-31b0cfc0af08",
    "type": "group",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "ae405b9d-57dd-4d50-93cc-31b0cfc0af08"
    ],
    "displayName": "Summary",
    "uri": "http://id.loc.gov/ontologies/bibframe/summary",
    "uriBFLite": "http://bibfra.me/vocab/marc/summary",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "children": ["2f4e3d64-ffae-4aa5-8fdb-2eaafaabca43"],
    "htmlId": "Monograph::0__Work::0__summary::0"
  },
  {
    "uuid": "2f4e3d64-ffae-4aa5-8fdb-2eaafaabca43",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "ae405b9d-57dd-4d50-93cc-31b0cfc0af08",
      "2f4e3d64-ffae-4aa5-8fdb-2eaafaabca43"
    ],
    "displayName": "Summary note",
    "uri": "http://www.w3.org/2000/01/rdf-schema#label",
    "uriBFLite": "http://bibfra.me/vocab/marc/summary",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__summary::0__Summary::0__summary::0"
  },
  {
    "uuid": "9cc073dd-7c9f-470d-b4d3-ae1b5d1afa1b",
    "type": "group",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "9cc073dd-7c9f-470d-b4d3-ae1b5d1afa1b"
    ],
    "displayName": "Subject of the Work",
    "uri": "http://id.loc.gov/ontologies/bibframe/subject",
    "uriBFLite": "http://bibfra.me/vocab/lite/subject",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "children": ["4154237a-12ee-441d-aab3-db831deaa5e3"],
    "htmlId": "Monograph::0__Work::0__subject::0"
  },
  {
    "uuid": "4154237a-12ee-441d-aab3-db831deaa5e3",
    "type": "complex",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "9cc073dd-7c9f-470d-b4d3-ae1b5d1afa1b",
      "4154237a-12ee-441d-aab3-db831deaa5e3"
    ],
    "displayName": "Search LCSH/LCNAF",
    "uri": "http://www.loc.gov/mads/rdf/v1#Topic",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/authorities/subjects", "http://preprod.id.loc.gov/authorities/names"],
      "valueDataType": { "dataTypeURI": "" }
    },
    "htmlId": "Monograph::0__Work::0__subject::0__v1#Topic$$madsTopic::0__v1#Topic::0"
  },
  {
    "uuid": "9fce2e4c-c16a-4ba8-b313-19ce2b9f47ff",
    "type": "dropdown",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "9fce2e4c-c16a-4ba8-b313-19ce2b9f47ff"
    ],
    "displayName": "Classification numbers",
    "uri": "http://id.loc.gov/ontologies/bibframe/classification",
    "uriBFLite": "http://bibfra.me/vocab/lite/classification",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "children": ["3a42ca3b-5209-421a-bf6f-5194ed65f6ef", "3713267f-85ab-457d-bb9d-9683503e1793"],
    "htmlId": "Monograph::0__Work::0__classification::0",
    "deletable": true,
    "cloneIndex": 0
  },
  {
    "uuid": "3a42ca3b-5209-421a-bf6f-5194ed65f6ef",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "9fce2e4c-c16a-4ba8-b313-19ce2b9f47ff",
      "3a42ca3b-5209-421a-bf6f-5194ed65f6ef"
    ],
    "displayName": "Library of Congress Classification",
    "bfid": "lc:RT:bf2:LCC",
    "uri": "http://id.loc.gov/ontologies/bibframe/ClassificationLcc",
    "uriBFLite": "lc",
    "children": [
      "311f033f-f9c6-4ef2-b6e5-c03eb6586ef2",
      "5620b7bb-52ad-4940-893b-82899037ac5b",
      "04a85032-54b4-48d4-9d98-68cd1038f041",
      "6dab3f13-e969-4835-b6b4-941b79c51374"
    ],
    "htmlId": "Monograph::0__Work::0__classification::0__lc$$LCC::0"
  },
  {
    "uuid": "311f033f-f9c6-4ef2-b6e5-c03eb6586ef2",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "9fce2e4c-c16a-4ba8-b313-19ce2b9f47ff",
      "3a42ca3b-5209-421a-bf6f-5194ed65f6ef",
      "311f033f-f9c6-4ef2-b6e5-c03eb6586ef2"
    ],
    "displayName": "Classification number",
    "uri": "http://id.loc.gov/ontologies/bibframe/classificationPortion",
    "uriBFLite": "http://bibfra.me/vocab/marc/code",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__classification::0__lc$$LCC::0__code::0"
  },
  {
    "uuid": "5620b7bb-52ad-4940-893b-82899037ac5b",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "9fce2e4c-c16a-4ba8-b313-19ce2b9f47ff",
      "3a42ca3b-5209-421a-bf6f-5194ed65f6ef",
      "5620b7bb-52ad-4940-893b-82899037ac5b"
    ],
    "displayName": "Additional call number information",
    "uri": "http://id.loc.gov/ontologies/bibframe/itemPortion",
    "uriBFLite": "http://bibfra.me/vocab/marc/itemNumber",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__classification::0__lc$$LCC::0__itemNumber::0"
  },
  {
    "uuid": "04a85032-54b4-48d4-9d98-68cd1038f041",
    "type": "complex",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "9fce2e4c-c16a-4ba8-b313-19ce2b9f47ff",
      "3a42ca3b-5209-421a-bf6f-5194ed65f6ef",
      "04a85032-54b4-48d4-9d98-68cd1038f041"
    ],
    "displayName": "Assigning agency",
    "uri": "http://id.loc.gov/ontologies/bibframe/assigner",
    "uriBFLite": "_assigningSourceReference",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/organizations"],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Agent"
      }
    },
    "htmlId": "Monograph::0__Work::0__classification::0__lc$$LCC::0___assigningSourceReference::0"
  },
  {
    "uuid": "6dab3f13-e969-4835-b6b4-941b79c51374",
    "type": "simple",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "9fce2e4c-c16a-4ba8-b313-19ce2b9f47ff",
      "3a42ca3b-5209-421a-bf6f-5194ed65f6ef",
      "6dab3f13-e969-4835-b6b4-941b79c51374"
    ],
    "displayName": "Used by assigning agency?",
    "uri": "http://id.loc.gov/ontologies/bibframe/status",
    "uriBFLite": "http://bibfra.me/vocab/marc/status",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/mstatus"],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Status"
      }
    },
    "htmlId": "Monograph::0__Work::0__classification::0__lc$$LCC::0__status::0"
  },
  {
    "uuid": "3713267f-85ab-457d-bb9d-9683503e1793",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "9fce2e4c-c16a-4ba8-b313-19ce2b9f47ff",
      "3713267f-85ab-457d-bb9d-9683503e1793"
    ],
    "displayName": "Dewey Decimal Classification",
    "bfid": "lc:RT:bf2:DDC",
    "uri": "http://id.loc.gov/ontologies/bibframe/ClassificationDdc",
    "uriBFLite": "ddc",
    "children": [
      "120f5e38-486e-43af-9cf8-8478b5a1f104",
      "d98116d7-5f07-4efa-8d24-e29fc1e6a814",
      "fcd9a0e2-c669-4502-ba4b-c65b070edcce",
      "b65f5677-3360-475b-9eb9-ab3cf649caed",
      "5ba117c8-1c9c-451e-a8e0-06cc1f5c7141"
    ],
    "htmlId": "Monograph::0__Work::0__classification::0__ddc$$DDC::0"
  },
  {
    "uuid": "120f5e38-486e-43af-9cf8-8478b5a1f104",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "9fce2e4c-c16a-4ba8-b313-19ce2b9f47ff",
      "3713267f-85ab-457d-bb9d-9683503e1793",
      "120f5e38-486e-43af-9cf8-8478b5a1f104"
    ],
    "displayName": "Classification number",
    "uri": "http://id.loc.gov/ontologies/bibframe/classificationPortion",
    "uriBFLite": "http://bibfra.me/vocab/marc/code",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__classification::0__ddc$$DDC::0__code::0"
  },
  {
    "uuid": "d98116d7-5f07-4efa-8d24-e29fc1e6a814",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "9fce2e4c-c16a-4ba8-b313-19ce2b9f47ff",
      "3713267f-85ab-457d-bb9d-9683503e1793",
      "d98116d7-5f07-4efa-8d24-e29fc1e6a814"
    ],
    "displayName": "Additional call number information",
    "uri": "http://id.loc.gov/ontologies/bibframe/itemPortion",
    "uriBFLite": "http://bibfra.me/vocab/marc/itemNumber",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__classification::0__ddc$$DDC::0__itemNumber::0"
  },
  {
    "uuid": "fcd9a0e2-c669-4502-ba4b-c65b070edcce",
    "type": "group",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "9fce2e4c-c16a-4ba8-b313-19ce2b9f47ff",
      "3713267f-85ab-457d-bb9d-9683503e1793",
      "fcd9a0e2-c669-4502-ba4b-c65b070edcce"
    ],
    "displayName": "Dewey Edition number",
    "uri": "http://id.loc.gov/ontologies/bibframe/source",
    "uriBFLite": "http://bibfra.me/vocab/marc/edition",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": { "dataTypeURI": "" }
    },
    "children": ["302b6d05-8883-43f8-9df9-79b14d5c0b09"],
    "htmlId": "Monograph::0__Work::0__classification::0__ddc$$DDC::0__edition::0"
  },
  {
    "uuid": "302b6d05-8883-43f8-9df9-79b14d5c0b09",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "9fce2e4c-c16a-4ba8-b313-19ce2b9f47ff",
      "3713267f-85ab-457d-bb9d-9683503e1793",
      "fcd9a0e2-c669-4502-ba4b-c65b070edcce",
      "302b6d05-8883-43f8-9df9-79b14d5c0b09"
    ],
    "displayName": "Dewey Edition number",
    "uri": "http://id.loc.gov/ontologies/bibframe/code",
    "uriBFLite": "http://bibfra.me/vocab/marc/editionNumber",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__classification::0__ddc$$DDC::0__edition::0__Source$$DDCEdNum::0__editionNumber::0"
  },
  {
    "uuid": "b65f5677-3360-475b-9eb9-ab3cf649caed",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "9fce2e4c-c16a-4ba8-b313-19ce2b9f47ff",
      "3713267f-85ab-457d-bb9d-9683503e1793",
      "b65f5677-3360-475b-9eb9-ab3cf649caed"
    ],
    "displayName": "Dewey full or abridged?",
    "uri": "http://id.loc.gov/ontologies/bibframe/edition",
    "uriBFLite": "http://bibfra.me/vocab/marc/edition",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__classification::0__ddc$$DDC::0__edition::0"
  },
  {
    "uuid": "5ba117c8-1c9c-451e-a8e0-06cc1f5c7141",
    "type": "complex",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "9fce2e4c-c16a-4ba8-b313-19ce2b9f47ff",
      "3713267f-85ab-457d-bb9d-9683503e1793",
      "5ba117c8-1c9c-451e-a8e0-06cc1f5c7141"
    ],
    "displayName": "Assigner",
    "uri": "http://id.loc.gov/ontologies/bibframe/assigner",
    "uriBFLite": "_assigningSourceReference",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/organizations"],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Agent"
      }
    },
    "htmlId": "Monograph::0__Work::0__classification::0__ddc$$DDC::0___assigningSourceReference::0"
  },
  {
    "uuid": "2d5f32f0-005f-4313-b1e0-7fa13fd9d50a",
    "type": "simple",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "2d5f32f0-005f-4313-b1e0-7fa13fd9d50a"
    ],
    "displayName": "Content Type",
    "uri": "http://id.loc.gov/ontologies/bibframe/content",
    "uriBFLite": "http://bibfra.me/vocab/marc/content",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/contentTypes"],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Content"
      }
    },
    "htmlId": "Monograph::0__Work::0__content::0"
  },
  /* {
    "uuid": "8e1f9732-1e16-4034-b060-b4c66a8c23b9",
    "type": "group",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "8e1f9732-1e16-4034-b060-b4c66a8c23b9"
    ],
    "displayName": "Language",
    "uri": "http://id.loc.gov/ontologies/bibframe/language",
    "uriBFLite": "http://bibfra.me/vocab/lite/language",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Language"
      }
    },
    "children": ["0c3d8d8d-a561-4750-a743-856a05c0d13e"],
    "htmlId": "Monograph::0__Work::0__language::0"
  }, */
  {
    "uuid": "0c3d8d8d-a561-4750-a743-856a05c0d13e",
    "type": "simple",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      // "8e1f9732-1e16-4034-b060-b4c66a8c23b9",
      "0c3d8d8d-a561-4750-a743-856a05c0d13e"
    ],
    "displayName": "Language code",
    "uri": "http://www.w3.org/2002/07/owl#sameAs",
    "uriBFLite": "http://bibfra.me/vocab/lite/language",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/languages"],
      "valueDataType": { "remark": "", "dataTypeURI": "" }
    },
    "htmlId": "Monograph::0__Work::0__language::0__Language$$Language2::0__language::0"
  },
  {
    "uuid": "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
    "type": "block",
    "path": ["ade54fa5-c456-4884-9996-241c913d1e6d", "f66de7a5-50b2-43d3-93b9-43b5f0e06433"],
    "displayName": "BIBFRAME Instance",
    "bfid": "lc:RT:bf2:Monograph:Instance",
    "uri": "http://id.loc.gov/ontologies/bibframe/Instance",
    "uriBFLite": "http://bibfra.me/vocab/lite/Instance",
    "children": [
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "532f832b-f819-4fee-8825-4991fbadd2d2",
      "31496b8e-348c-4459-92dc-d182b17cd9fd",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "3aa93ef0-ce50-4694-a52e-30f68258bb90",
      "7f44231d-857c-4417-9809-d0155e9650f6",
      "233733f1-2235-4c3c-9af9-7b78f5932ec1",
      "5e3dbdaa-9b6b-465d-b006-1c74db8df8de",
      "c49d71ba-aaf9-4f53-8d94-541b12af20c2",
      "b9401d74-ede6-4573-9c0d-46df374c0a2c",
      // "80d2bad5-ff0d-4204-b7ea-c224fbaa2a04",
      "d67511ae-335d-4a87-99ca-6c17027171c0",
      "bf793ffd-1630-4526-861a-bb9485cec5bc",
      "bf793ffd-1630-4526-861a-bb9485cec5bc1",
      "ad763206-75f3-467b-8539-034182eec383",
      "a3efd7ed-0d62-4f8f-9133-c4ef4d348271",
    ],
    "htmlId": "Monograph::0__Instance::0"
  },
  {
    "uuid": "95619ddc-f991-45c0-aea3-6406a266ad83",
    "type": "dropdown",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83"
    ],
    "displayName": "Title Information",
    "uri": "http://id.loc.gov/ontologies/bibframe/title",
    "uriBFLite": "http://bibfra.me/vocab/marc/title",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": { "remark": "" }
    },
    "children": [
      "b1eecdb6-dc9e-4a91-bdde-e2d60e8af9bf",
      "14b45b86-46b3-4863-9b17-cf587c3c7335",
      "5aec9965-4e22-47f4-99c2-5f51607a457c"
    ],
    "htmlId": "Monograph::0__Instance::0__title::0"
  },
  {
    "uuid": "b1eecdb6-dc9e-4a91-bdde-e2d60e8af9bf",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "b1eecdb6-dc9e-4a91-bdde-e2d60e8af9bf"
    ],
    "displayName": "Instance Title",
    "bfid": "lc:RT:bf2:InstanceTitle",
    "uri": "http://id.loc.gov/ontologies/bibframe/Title",
    "uriBFLite": "http://bibfra.me/vocab/marc/Title",
    "children": [
      "dd9a7fb2-37a3-41a6-a4b5-8ad00430f5b6",
      "15b34769-7422-4f5b-9319-fb788611bce8",
      "dd2afbf1-030a-4def-9f06-e32522506ac6",
      "341076f2-5046-4a11-8e43-685228815e18",
      "ace03b51-9c2a-49d8-81cc-43e48a6f4696"
    ],
    "htmlId": "Monograph::0__Instance::0__title::0__Title$$InstanceTitle::0"
  },
  {
    "uuid": "dd9a7fb2-37a3-41a6-a4b5-8ad00430f5b6",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "b1eecdb6-dc9e-4a91-bdde-e2d60e8af9bf",
      "dd9a7fb2-37a3-41a6-a4b5-8ad00430f5b6"
    ],
    "displayName": "Non-sort character count",
    "uri": "http://id.loc.gov/ontologies/bflc/nonSortNum",
    "uriBFLite": "http://bibfra.me/vocab/bflc/nonSortNum",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__title::0__Title$$InstanceTitle::0__nonSortNum::0"
  },
  {
    "uuid": "15b34769-7422-4f5b-9319-fb788611bce8",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "b1eecdb6-dc9e-4a91-bdde-e2d60e8af9bf",
      "15b34769-7422-4f5b-9319-fb788611bce8"
    ],
    "displayName": "Main Title",
    "uri": "http://id.loc.gov/ontologies/bibframe/mainTitle",
    "uriBFLite": "http://bibfra.me/vocab/marc/mainTitle",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__title::0__Title$$InstanceTitle::0__mainTitle::0"
  },
  {
    "uuid": "dd2afbf1-030a-4def-9f06-e32522506ac6",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "b1eecdb6-dc9e-4a91-bdde-e2d60e8af9bf",
      "dd2afbf1-030a-4def-9f06-e32522506ac6"
    ],
    "displayName": "Part number",
    "uri": "http://id.loc.gov/ontologies/bibframe/partNumber",
    "uriBFLite": "http://bibfra.me/vocab/marc/partNumber",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__title::0__Title$$InstanceTitle::0__partNumber::0"
  },
  {
    "uuid": "341076f2-5046-4a11-8e43-685228815e18",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "b1eecdb6-dc9e-4a91-bdde-e2d60e8af9bf",
      "341076f2-5046-4a11-8e43-685228815e18"
    ],
    "displayName": "Part name",
    "uri": "http://id.loc.gov/ontologies/bibframe/partName",
    "uriBFLite": "http://bibfra.me/vocab/marc/partName",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__title::0__Title$$InstanceTitle::0__partName::0"
  },
  {
    "uuid": "ace03b51-9c2a-49d8-81cc-43e48a6f4696",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "b1eecdb6-dc9e-4a91-bdde-e2d60e8af9bf",
      "ace03b51-9c2a-49d8-81cc-43e48a6f4696"
    ],
    "displayName": "Other Title Information",
    "uri": "http://id.loc.gov/ontologies/bibframe/subtitle",
    "uriBFLite": "http://bibfra.me/vocab/marc/subTitle",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__title::0__Title$$InstanceTitle::0__subTitle::0"
  },
  {
    "uuid": "14b45b86-46b3-4863-9b17-cf587c3c7335",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "14b45b86-46b3-4863-9b17-cf587c3c7335"
    ],
    "displayName": "Variant Title",
    "bfid": "lc:RT:bf2:Title:VarTitle",
    "uri": "http://id.loc.gov/ontologies/bibframe/VariantTitle",
    "uriBFLite": "http://bibfra.me/vocab/marc/VariantTitle",
    "children": [
      "8cc6552c-e8f4-40a1-9f3e-b9acd9ff0dab",
      "d656d1bf-ef0d-430a-851d-717b199aff28",
      "46473732-e8ab-450b-81a8-9e186e529d5a",
      "4771c87a-9355-4431-90a6-db8b9aea0aff",
      "1171491a-de3b-4148-bb73-5568f9a678cd",
      "35164ffe-82cd-41d0-a7a3-fd06c87a1624",
      "56628118-c0d6-45b9-809b-d7f7207bd0d9"
    ],
    "htmlId": "Monograph::0__Instance::0__title::0__VariantTitle$$VarTitle::0"
  },
  {
    "uuid": "8cc6552c-e8f4-40a1-9f3e-b9acd9ff0dab",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "14b45b86-46b3-4863-9b17-cf587c3c7335",
      "8cc6552c-e8f4-40a1-9f3e-b9acd9ff0dab"
    ],
    "displayName": "Variant Title",
    "uri": "http://id.loc.gov/ontologies/bibframe/mainTitle",
    "uriBFLite": "http://bibfra.me/vocab/marc/mainTitle",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__title::0__VariantTitle$$VarTitle::0__mainTitle::0"
  },
  {
    "uuid": "d656d1bf-ef0d-430a-851d-717b199aff28",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "14b45b86-46b3-4863-9b17-cf587c3c7335",
      "d656d1bf-ef0d-430a-851d-717b199aff28"
    ],
    "displayName": "Part number",
    "uri": "http://id.loc.gov/ontologies/bibframe/partNumber",
    "uriBFLite": "http://bibfra.me/vocab/marc/partNumber",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__title::0__VariantTitle$$VarTitle::0__partNumber::0"
  },
  {
    "uuid": "46473732-e8ab-450b-81a8-9e186e529d5a",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "14b45b86-46b3-4863-9b17-cf587c3c7335",
      "46473732-e8ab-450b-81a8-9e186e529d5a"
    ],
    "displayName": "Part name",
    "uri": "http://id.loc.gov/ontologies/bibframe/partName",
    "uriBFLite": "http://bibfra.me/vocab/marc/partName",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__title::0__VariantTitle$$VarTitle::0__partName::0"
  },
  {
    "uuid": "4771c87a-9355-4431-90a6-db8b9aea0aff",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "14b45b86-46b3-4863-9b17-cf587c3c7335",
      "4771c87a-9355-4431-90a6-db8b9aea0aff"
    ],
    "displayName": "Other title information",
    "uri": "http://id.loc.gov/ontologies/bibframe/subtitle",
    "uriBFLite": "http://bibfra.me/vocab/marc/subTitle",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__title::0__VariantTitle$$VarTitle::0__subTitle::0"
  },
  {
    "uuid": "1171491a-de3b-4148-bb73-5568f9a678cd",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "14b45b86-46b3-4863-9b17-cf587c3c7335",
      "1171491a-de3b-4148-bb73-5568f9a678cd"
    ],
    "displayName": "Date",
    "uri": "http://id.loc.gov/ontologies/bibframe/date",
    "uriBFLite": "http://bibfra.me/vocab/lite/date",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__title::0__VariantTitle$$VarTitle::0__date::0"
  },
  {
    "uuid": "35164ffe-82cd-41d0-a7a3-fd06c87a1624",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "14b45b86-46b3-4863-9b17-cf587c3c7335",
      "35164ffe-82cd-41d0-a7a3-fd06c87a1624"
    ],
    "displayName": "Variant title type",
    "uri": "http://id.loc.gov/ontologies/bibframe/variantType",
    "uriBFLite": "http://bibfra.me/vocab/marc/variantType",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__title::0__VariantTitle$$VarTitle::0__variantType::0"
  },
  {
    "uuid": "56628118-c0d6-45b9-809b-d7f7207bd0d9",
    "type": "group",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "14b45b86-46b3-4863-9b17-cf587c3c7335",
      "56628118-c0d6-45b9-809b-d7f7207bd0d9"
    ],
    "displayName": "Note",
    "uri": "http://id.loc.gov/ontologies/bibframe/note",
    "uriBFLite": "http://bibfra.me/vocab/lite/note",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "children": ["1868f304-d36d-4022-a3ea-07b89acbafc1"],
    "htmlId": "Monograph::0__Instance::0__title::0__VariantTitle$$VarTitle::0__note::0"
  },
  {
    "uuid": "1868f304-d36d-4022-a3ea-07b89acbafc1",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "14b45b86-46b3-4863-9b17-cf587c3c7335",
      "56628118-c0d6-45b9-809b-d7f7207bd0d9",
      "1868f304-d36d-4022-a3ea-07b89acbafc1"
    ],
    "displayName": "Note",
    "uri": "http://www.w3.org/2000/01/rdf-schema#label",
    "uriBFLite": "http://bibfra.me/vocab/lite/note",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__title::0__VariantTitle$$VarTitle::0__note::0__Note$$NoteSimple::0__note::0"
  },
  {
    "uuid": "5aec9965-4e22-47f4-99c2-5f51607a457c",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "5aec9965-4e22-47f4-99c2-5f51607a457c"
    ],
    "displayName": "Parallel Title",
    "bfid": "lc:RT:bf2:ParallelTitle",
    "uri": "http://id.loc.gov/ontologies/bibframe/ParallelTitle",
    "uriBFLite": "http://bibfra.me/vocab/marc/ParallelTitle",
    "children": [
      "fddc6d71-77e5-4a11-bce1-77eb19beec6b",
      "4b1d6c01-c8a7-4eac-85f2-2fad50dbc820",
      "24ace688-56b6-4a95-b8d5-de2912700561",
      "149c7402-2963-4f2e-b4d0-47e5088356f6",
      "e4a9740f-3795-4af1-8015-46d5f5636946",
      "9248bc51-b492-458b-be4d-d1814b05d184"
    ],
    "htmlId": "Monograph::0__Instance::0__title::0__ParallelTitle::0"
  },
  {
    "uuid": "fddc6d71-77e5-4a11-bce1-77eb19beec6b",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "5aec9965-4e22-47f4-99c2-5f51607a457c",
      "fddc6d71-77e5-4a11-bce1-77eb19beec6b"
    ],
    "displayName": "Parallel Title",
    "uri": "http://id.loc.gov/ontologies/bibframe/mainTitle",
    "uriBFLite": "http://bibfra.me/vocab/marc/mainTitle",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__title::0__ParallelTitle::0__mainTitle::0"
  },
  {
    "uuid": "4b1d6c01-c8a7-4eac-85f2-2fad50dbc820",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "5aec9965-4e22-47f4-99c2-5f51607a457c",
      "4b1d6c01-c8a7-4eac-85f2-2fad50dbc820"
    ],
    "displayName": "Other Title Information",
    "uri": "http://id.loc.gov/ontologies/bibframe/subtitle",
    "uriBFLite": "http://bibfra.me/vocab/marc/subTitle",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__title::0__ParallelTitle::0__subTitle::0"
  },
  {
    "uuid": "24ace688-56b6-4a95-b8d5-de2912700561",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "5aec9965-4e22-47f4-99c2-5f51607a457c",
      "24ace688-56b6-4a95-b8d5-de2912700561"
    ],
    "displayName": "Part number",
    "uri": "http://id.loc.gov/ontologies/bibframe/partNumber",
    "uriBFLite": "http://bibfra.me/vocab/marc/partNumber",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__title::0__ParallelTitle::0__partNumber::0"
  },
  {
    "uuid": "149c7402-2963-4f2e-b4d0-47e5088356f6",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "5aec9965-4e22-47f4-99c2-5f51607a457c",
      "149c7402-2963-4f2e-b4d0-47e5088356f6"
    ],
    "displayName": "Part name",
    "uri": "http://id.loc.gov/ontologies/bibframe/partName",
    "uriBFLite": "http://bibfra.me/vocab/marc/partName",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__title::0__ParallelTitle::0__partName::0"
  },
  {
    "uuid": "e4a9740f-3795-4af1-8015-46d5f5636946",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "5aec9965-4e22-47f4-99c2-5f51607a457c",
      "e4a9740f-3795-4af1-8015-46d5f5636946"
    ],
    "displayName": "Date",
    "uri": "http://id.loc.gov/ontologies/bibframe/date",
    "uriBFLite": "http://bibfra.me/vocab/lite/date",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__title::0__ParallelTitle::0__date::0"
  },
  {
    "uuid": "9248bc51-b492-458b-be4d-d1814b05d184",
    "type": "group",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "5aec9965-4e22-47f4-99c2-5f51607a457c",
      "9248bc51-b492-458b-be4d-d1814b05d184"
    ],
    "displayName": "Note",
    "uri": "http://id.loc.gov/ontologies/bibframe/note",
    "uriBFLite": "http://bibfra.me/vocab/lite/note",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "children": ["62ab9e4b-fde9-4803-9a8f-89eb621c9cb5"],
    "htmlId": "Monograph::0__Instance::0__title::0__ParallelTitle::0__note::0"
  },
  {
    "uuid": "62ab9e4b-fde9-4803-9a8f-89eb621c9cb5",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "95619ddc-f991-45c0-aea3-6406a266ad83",
      "5aec9965-4e22-47f4-99c2-5f51607a457c",
      "9248bc51-b492-458b-be4d-d1814b05d184",
      "62ab9e4b-fde9-4803-9a8f-89eb621c9cb5"
    ],
    "displayName": "Note",
    "uri": "http://www.w3.org/2000/01/rdf-schema#label",
    "uriBFLite": "http://bibfra.me/vocab/lite/note",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__title::0__ParallelTitle::0__note::0__Note$$NoteSimple::0__note::0"
  },
  {
    "uuid": "532f832b-f819-4fee-8825-4991fbadd2d2",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "532f832b-f819-4fee-8825-4991fbadd2d2"
    ],
    "displayName": "Statement of Responsibility",
    "uri": "http://id.loc.gov/ontologies/bibframe/responsibilityStatement",
    "uriBFLite": "http://bibfra.me/vocab/marc/statementOfResponsibility",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__statementOfResponsibility::0"
  },
  {
    "uuid": "31496b8e-348c-4459-92dc-d182b17cd9fd",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "31496b8e-348c-4459-92dc-d182b17cd9fd"
    ],
    "displayName": "Edition Statement",
    "uri": "http://id.loc.gov/ontologies/bibframe/editionStatement",
    "uriBFLite": "http://bibfra.me/vocab/marc/edition",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__edition::0"
  },
  {
    "uuid": "33640926-47f1-434c-b97b-fd83ad436ebd",
    "type": "dropdown",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd"
    ],
    "displayName": "Provision Activity",
    "uri": "http://id.loc.gov/ontologies/bibframe/provisionActivity",
    "uriBFLite": "https://bibfra.me/vocab/marc/provisionActivity",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "children": [
      "fdfddeb6-c035-4e60-8ec0-9a1f2416ebb2",
      "1684d0f9-37b7-45b8-91bf-6d12e07e136a",
      "262d5203-ec7f-425f-94e2-f8a7fc775577",
      "7028fb40-0384-44bc-a72f-40ff7722b6ac"
    ],
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0"
  },
  {
    "uuid": "fdfddeb6-c035-4e60-8ec0-9a1f2416ebb2",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "fdfddeb6-c035-4e60-8ec0-9a1f2416ebb2"
    ],
    "displayName": "Publication",
    "bfid": "lc:RT:bf2:PubInfoNew",
    "uri": "http://id.loc.gov/ontologies/bibframe/Publication",
    "uriBFLite": "http://bibfra.me/vocab/marc/publication",
    "children": [
      "f0108b5b-3875-4415-b7e9-83a54ecfb845",
      "d5ebce36-8fee-467a-93b0-3191651f5c64",
      "3ae4a149-e45a-44bb-b511-d6ab569c1023",
      "98f80d8c-2ef1-49ec-9c7a-4f51ccf41ad6",
      "38230a31-d825-4ac8-8edd-104f526cd6e3"
    ],
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__publication$$PubInfoNew::0"
  },
  {
    "uuid": "f0108b5b-3875-4415-b7e9-83a54ecfb845",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "fdfddeb6-c035-4e60-8ec0-9a1f2416ebb2",
      "f0108b5b-3875-4415-b7e9-83a54ecfb845"
    ],
    "displayName": "EDTF Date (to/from 008)",
    "uri": "http://id.loc.gov/ontologies/bibframe/date",
    "uriBFLite": "http://bibfra.me/vocab/lite/providerDate",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__publication$$PubInfoNew::0__providerDate::0"
  },
  {
    "uuid": "d5ebce36-8fee-467a-93b0-3191651f5c64",
    "type": "simple",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "fdfddeb6-c035-4e60-8ec0-9a1f2416ebb2",
      "d5ebce36-8fee-467a-93b0-3191651f5c64"
    ],
    "displayName": "Search place of publication (to/from 008)",
    "uri": "http://id.loc.gov/ontologies/bibframe/place",
    "uriBFLite": "http://bibfra.me/vocab/lite/providerPlace",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/countries"],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Place"
      }
    },
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__publication$$PubInfoNew::0__providerPlace::0"
  },
  {
    "uuid": "3ae4a149-e45a-44bb-b511-d6ab569c1023",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "fdfddeb6-c035-4e60-8ec0-9a1f2416ebb2",
      "3ae4a149-e45a-44bb-b511-d6ab569c1023"
    ],
    "displayName": "Place (to/from 26X $a)",
    "uri": "http://id.loc.gov/ontologies/bflc/simplePlace",
    "uriBFLite": "http://bibfra.me/vocab/lite/place",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__publication$$PubInfoNew::0__place::0"
  },
  {
    "uuid": "98f80d8c-2ef1-49ec-9c7a-4f51ccf41ad6",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "fdfddeb6-c035-4e60-8ec0-9a1f2416ebb2",
      "98f80d8c-2ef1-49ec-9c7a-4f51ccf41ad6"
    ],
    "displayName": "Name (to/from 26X $b)",
    "uri": "http://id.loc.gov/ontologies/bflc/simpleAgent",
    "uriBFLite": "http://bibfra.me/vocab/lite/name",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__publication$$PubInfoNew::0__name::0"
  },
  {
    "uuid": "38230a31-d825-4ac8-8edd-104f526cd6e3",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "fdfddeb6-c035-4e60-8ec0-9a1f2416ebb2",
      "38230a31-d825-4ac8-8edd-104f526cd6e3"
    ],
    "displayName": "Date (to/from 26X $c)",
    "uri": "http://id.loc.gov/ontologies/bflc/simpleDate",
    "uriBFLite": "http://bibfra.me/vocab/lite/date",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__publication$$PubInfoNew::0__date::0"
  },
  {
    "uuid": "1684d0f9-37b7-45b8-91bf-6d12e07e136a",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "1684d0f9-37b7-45b8-91bf-6d12e07e136a"
    ],
    "displayName": "Distribution",
    "bfid": "lc:RT:bf2:DistInfoNew",
    "uri": "http://id.loc.gov/ontologies/bibframe/Distribution",
    "uriBFLite": "http://bibfra.me/vocab/marc/distribution",
    "children": [
      "5cfb60f5-18cf-4817-8748-228f0fc8d65c",
      "cf940691-a5f5-42d2-92c5-861b9e5f696d",
      "2d396b58-3bb3-4c61-a520-86bad451f080",
      "c663d43b-2cd3-4270-91da-3baef05d1793",
      "0b3298de-00a8-4eb3-b6ec-bd26795c1be8"
    ],
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__distribution$$DistInfoNew::0"
  },
  {
    "uuid": "5cfb60f5-18cf-4817-8748-228f0fc8d65c",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "1684d0f9-37b7-45b8-91bf-6d12e07e136a",
      "5cfb60f5-18cf-4817-8748-228f0fc8d65c"
    ],
    "displayName": "EDTF Date (to/from 008)",
    "uri": "http://id.loc.gov/ontologies/bibframe/date",
    "uriBFLite": "http://bibfra.me/vocab/lite/providerDate",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__distribution$$DistInfoNew::0__providerDate::0"
  },
  {
    "uuid": "cf940691-a5f5-42d2-92c5-861b9e5f696d",
    "type": "simple",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "1684d0f9-37b7-45b8-91bf-6d12e07e136a",
      "cf940691-a5f5-42d2-92c5-861b9e5f696d"
    ],
    "displayName": "Search place of publication (to/from 008)",
    "uri": "http://id.loc.gov/ontologies/bibframe/place",
    "uriBFLite": "http://bibfra.me/vocab/lite/providerPlace",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/countries"],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Place"
      }
    },
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__distribution$$DistInfoNew::0__providerPlace::0"
  },
  {
    "uuid": "2d396b58-3bb3-4c61-a520-86bad451f080",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "1684d0f9-37b7-45b8-91bf-6d12e07e136a",
      "2d396b58-3bb3-4c61-a520-86bad451f080"
    ],
    "displayName": "Place (to/from 26X $a)",
    "uri": "http://id.loc.gov/ontologies/bflc/simplePlace",
    "uriBFLite": "http://bibfra.me/vocab/lite/place",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__distribution$$DistInfoNew::0__place::0"
  },
  {
    "uuid": "c663d43b-2cd3-4270-91da-3baef05d1793",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "1684d0f9-37b7-45b8-91bf-6d12e07e136a",
      "c663d43b-2cd3-4270-91da-3baef05d1793"
    ],
    "displayName": "Name (to/from 26X $b)",
    "uri": "http://id.loc.gov/ontologies/bflc/simpleAgent",
    "uriBFLite": "http://bibfra.me/vocab/lite/name",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__distribution$$DistInfoNew::0__name::0"
  },
  {
    "uuid": "0b3298de-00a8-4eb3-b6ec-bd26795c1be8",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "1684d0f9-37b7-45b8-91bf-6d12e07e136a",
      "0b3298de-00a8-4eb3-b6ec-bd26795c1be8"
    ],
    "displayName": "Date (to/from 26X $c)",
    "uri": "http://id.loc.gov/ontologies/bflc/simpleDate",
    "uriBFLite": "http://bibfra.me/vocab/lite/date",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__distribution$$DistInfoNew::0__date::0"
  },
  {
    "uuid": "262d5203-ec7f-425f-94e2-f8a7fc775577",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "262d5203-ec7f-425f-94e2-f8a7fc775577"
    ],
    "displayName": "Manufacture",
    "bfid": "lc:RT:bf2:ManuInfoNew",
    "uri": "http://id.loc.gov/ontologies/bibframe/Manufacture",
    "uriBFLite": "http://bibfra.me/vocab/marc/manufacture",
    "children": [
      "8d7c33a8-c6f9-4596-a16b-664587c13525",
      "742e6dd2-3d4b-4c9f-ba7b-d7877eb7c104",
      "b6379bd2-75f3-411e-a886-557894b5c51c",
      "0b7f7927-40a4-4c1b-9484-3ffe07c2ebf5",
      "4552004c-10cd-402b-85fb-1b0d64ca52cd"
    ],
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__manufacture$$ManuInfoNew::0"
  },
  {
    "uuid": "8d7c33a8-c6f9-4596-a16b-664587c13525",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "262d5203-ec7f-425f-94e2-f8a7fc775577",
      "8d7c33a8-c6f9-4596-a16b-664587c13525"
    ],
    "displayName": "EDTF Date (to/from 008)",
    "uri": "http://id.loc.gov/ontologies/bibframe/date",
    "uriBFLite": "http://bibfra.me/vocab/lite/providerDate",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__manufacture$$ManuInfoNew::0__providerDate::0"
  },
  {
    "uuid": "742e6dd2-3d4b-4c9f-ba7b-d7877eb7c104",
    "type": "simple",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "262d5203-ec7f-425f-94e2-f8a7fc775577",
      "742e6dd2-3d4b-4c9f-ba7b-d7877eb7c104"
    ],
    "displayName": "Search place of publication (to/from 008)",
    "uri": "http://id.loc.gov/ontologies/bibframe/place",
    "uriBFLite": "http://bibfra.me/vocab/lite/providerPlace",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/countries"],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Place"
      }
    },
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__manufacture$$ManuInfoNew::0__providerPlace::0"
  },
  {
    "uuid": "b6379bd2-75f3-411e-a886-557894b5c51c",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "262d5203-ec7f-425f-94e2-f8a7fc775577",
      "b6379bd2-75f3-411e-a886-557894b5c51c"
    ],
    "displayName": "Place (to/from 26X $a)",
    "uri": "http://id.loc.gov/ontologies/bflc/simplePlace",
    "uriBFLite": "http://bibfra.me/vocab/lite/place",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__manufacture$$ManuInfoNew::0__place::0"
  },
  {
    "uuid": "0b7f7927-40a4-4c1b-9484-3ffe07c2ebf5",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "262d5203-ec7f-425f-94e2-f8a7fc775577",
      "0b7f7927-40a4-4c1b-9484-3ffe07c2ebf5"
    ],
    "displayName": "Name (to/from 26X $b)",
    "uri": "http://id.loc.gov/ontologies/bflc/simpleAgent",
    "uriBFLite": "http://bibfra.me/vocab/lite/name",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__manufacture$$ManuInfoNew::0__name::0"
  },
  {
    "uuid": "4552004c-10cd-402b-85fb-1b0d64ca52cd",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "262d5203-ec7f-425f-94e2-f8a7fc775577",
      "4552004c-10cd-402b-85fb-1b0d64ca52cd"
    ],
    "displayName": "Date (to/from 26X $c)",
    "uri": "http://id.loc.gov/ontologies/bflc/simpleDate",
    "uriBFLite": "http://bibfra.me/vocab/lite/date",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__manufacture$$ManuInfoNew::0__date::0"
  },
  {
    "uuid": "7028fb40-0384-44bc-a72f-40ff7722b6ac",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "7028fb40-0384-44bc-a72f-40ff7722b6ac"
    ],
    "displayName": "Production",
    "bfid": "lc:RT:bf2:ProdInfoNew",
    "uri": "http://id.loc.gov/ontologies/bibframe/Production",
    "uriBFLite": "http://bibfra.me/vocab/marc/production",
    "children": [
      "37981120-a0cc-45af-8c4e-0755e5b3ae76",
      "29e7bacb-d284-40e8-8b87-76c755737c97",
      "a9e90966-696b-49de-8ad9-d4e5289796a2",
      "0e120f8e-8c6b-49b1-8578-e21a51685b10",
      "47231677-e145-413c-bdf9-b95aba7c2bf4"
    ],
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__production$$ProdInfoNew::0"
  },
  {
    "uuid": "37981120-a0cc-45af-8c4e-0755e5b3ae76",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "7028fb40-0384-44bc-a72f-40ff7722b6ac",
      "37981120-a0cc-45af-8c4e-0755e5b3ae76"
    ],
    "displayName": "EDTF Date (to/from 008)",
    "uri": "http://id.loc.gov/ontologies/bibframe/date",
    "uriBFLite": "http://bibfra.me/vocab/lite/providerDate",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__production$$ProdInfoNew::0__providerDate::0"
  },
  {
    "uuid": "29e7bacb-d284-40e8-8b87-76c755737c97",
    "type": "simple",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "7028fb40-0384-44bc-a72f-40ff7722b6ac",
      "29e7bacb-d284-40e8-8b87-76c755737c97"
    ],
    "displayName": "Search place of publication (to/from 008)",
    "uri": "http://id.loc.gov/ontologies/bibframe/place",
    "uriBFLite": "http://bibfra.me/vocab/lite/providerPlace",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/countries"],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Place"
      }
    },
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__production$$ProdInfoNew::0__providerPlace::0"
  },
  {
    "uuid": "a9e90966-696b-49de-8ad9-d4e5289796a2",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "7028fb40-0384-44bc-a72f-40ff7722b6ac",
      "a9e90966-696b-49de-8ad9-d4e5289796a2"
    ],
    "displayName": "Place (to/from 26X $a)",
    "uri": "http://id.loc.gov/ontologies/bflc/simplePlace",
    "uriBFLite": "http://bibfra.me/vocab/lite/place",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__production$$ProdInfoNew::0__place::0"
  },
  {
    "uuid": "0e120f8e-8c6b-49b1-8578-e21a51685b10",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "7028fb40-0384-44bc-a72f-40ff7722b6ac",
      "0e120f8e-8c6b-49b1-8578-e21a51685b10"
    ],
    "displayName": "Name (to/from 26X $b)",
    "uri": "http://id.loc.gov/ontologies/bflc/simpleAgent",
    "uriBFLite": "http://bibfra.me/vocab/lite/name",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__production$$ProdInfoNew::0__name::0"
  },
  {
    "uuid": "47231677-e145-413c-bdf9-b95aba7c2bf4",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "33640926-47f1-434c-b97b-fd83ad436ebd",
      "7028fb40-0384-44bc-a72f-40ff7722b6ac",
      "47231677-e145-413c-bdf9-b95aba7c2bf4"
    ],
    "displayName": "Date (to/from 26X $c)",
    "uri": "http://id.loc.gov/ontologies/bflc/simpleDate",
    "uriBFLite": "http://bibfra.me/vocab/lite/date",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__provisionActivity::0__production$$ProdInfoNew::0__date::0"
  },
  {
    "uuid": "3aa93ef0-ce50-4694-a52e-30f68258bb90",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "3aa93ef0-ce50-4694-a52e-30f68258bb90"
    ],
    "displayName": "Copyright Date",
    "uri": "http://id.loc.gov/ontologies/bibframe/copyrightDate",
    "uriBFLite": "http://bibfra.me/vocab/marc/copyright",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__copyright::0"
  },
  {
    "uuid": "7f44231d-857c-4417-9809-d0155e9650f6",
    "type": "simple",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "7f44231d-857c-4417-9809-d0155e9650f6"
    ],
    "displayName": "Mode of Issuance",
    "uri": "http://id.loc.gov/ontologies/bibframe/issuance",
    "uriBFLite": "http://bibfra.me/vocab/marc/issuance",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/issuance"],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Issuance"
      }
    },
    "htmlId": "Monograph::0__Instance::0__issuance::0"
  },
  {
    "uuid": "233733f1-2235-4c3c-9af9-7b78f5932ec1",
    "type": "dropdown",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "233733f1-2235-4c3c-9af9-7b78f5932ec1"
    ],
    "displayName": "Identifiers",
    "uri": "http://id.loc.gov/ontologies/bibframe/identifiedBy",
    "uriBFLite": "http://library.link/vocab/map",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "children": ["10ba25e4-8bea-4415-935d-ea1dc7a22dd7", "a2b5391b-baf6-4bcb-b26b-4dd861833b18"],
    "htmlId": "Monograph::0__Instance::0__map::0"
  },
  {
    "uuid": "10ba25e4-8bea-4415-935d-ea1dc7a22dd7",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "233733f1-2235-4c3c-9af9-7b78f5932ec1",
      "10ba25e4-8bea-4415-935d-ea1dc7a22dd7"
    ],
    "displayName": "LCCN",
    "bfid": "lc:RT:bf2:Identifiers:LCCN",
    "uri": "http://id.loc.gov/ontologies/bibframe/Lccn",
    "uriBFLite": "http://library.link/identifier/LCCN",
    "children": ["cf1bb8c1-1b52-4b3a-a135-4bfb6206891d", "9817f3cc-14da-4018-96ed-8a339a6125e3"],
    "htmlId": "Monograph::0__Instance::0__map::0__LCCN::0"
  },
  {
    "uuid": "cf1bb8c1-1b52-4b3a-a135-4bfb6206891d",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "233733f1-2235-4c3c-9af9-7b78f5932ec1",
      "10ba25e4-8bea-4415-935d-ea1dc7a22dd7",
      "cf1bb8c1-1b52-4b3a-a135-4bfb6206891d"
    ],
    "displayName": "LCCN",
    "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
    "uriBFLite": "http://bibfra.me/vocab/lite/name",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__map::0__LCCN::0__name::0"
  },
  {
    "uuid": "9817f3cc-14da-4018-96ed-8a339a6125e3",
    "type": "simple",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "233733f1-2235-4c3c-9af9-7b78f5932ec1",
      "10ba25e4-8bea-4415-935d-ea1dc7a22dd7",
      "9817f3cc-14da-4018-96ed-8a339a6125e3"
    ],
    "displayName": "Invalid/Canceled?",
    "uri": "http://id.loc.gov/ontologies/bibframe/status",
    "uriBFLite": "http://bibfra.me/vocab/marc/status",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/mstatus"],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Status"
      }
    },
    "htmlId": "Monograph::0__Instance::0__map::0__LCCN::0__status::0"
  },
  {
    "uuid": "a2b5391b-baf6-4bcb-b26b-4dd861833b18",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "233733f1-2235-4c3c-9af9-7b78f5932ec1",
      "a2b5391b-baf6-4bcb-b26b-4dd861833b18"
    ],
    "displayName": "ISBN",
    "bfid": "lc:RT:bf2:Identifiers:ISBN",
    "uri": "http://id.loc.gov/ontologies/bibframe/Isbn",
    "uriBFLite": "http://library.link/identifier/ISBN",
    "children": [
      "ba3a9722-eed5-48f9-8420-c78adc991187",
      "490f2ba0-fee0-4528-b77f-c47099ab8426",
      "1960fe69-05cb-491f-9d54-945855497313"
    ],
    "htmlId": "Monograph::0__Instance::0__map::0__ISBN::0"
  },
  {
    "uuid": "ba3a9722-eed5-48f9-8420-c78adc991187",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "233733f1-2235-4c3c-9af9-7b78f5932ec1",
      "a2b5391b-baf6-4bcb-b26b-4dd861833b18",
      "ba3a9722-eed5-48f9-8420-c78adc991187"
    ],
    "displayName": "ISBN",
    "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
    "uriBFLite": "http://bibfra.me/vocab/lite/name",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__map::0__ISBN::0__name::0"
  },
  {
    "uuid": "490f2ba0-fee0-4528-b77f-c47099ab8426",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "233733f1-2235-4c3c-9af9-7b78f5932ec1",
      "a2b5391b-baf6-4bcb-b26b-4dd861833b18",
      "490f2ba0-fee0-4528-b77f-c47099ab8426"
    ],
    "displayName": "Qualifier",
    "uri": "http://id.loc.gov/ontologies/bibframe/qualifier",
    "uriBFLite": "http://bibfra.me/vocab/marc/qualifier",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__map::0__ISBN::0__qualifier::0"
  },
  {
    "uuid": "1960fe69-05cb-491f-9d54-945855497313",
    "type": "simple",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "233733f1-2235-4c3c-9af9-7b78f5932ec1",
      "a2b5391b-baf6-4bcb-b26b-4dd861833b18",
      "1960fe69-05cb-491f-9d54-945855497313"
    ],
    "displayName": "Incorrect, Invalid or Canceled?",
    "uri": "http://id.loc.gov/ontologies/bibframe/status",
    "uriBFLite": "http://bibfra.me/vocab/marc/status",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/mstatus"],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Status"
      }
    },
    "htmlId": "Monograph::0__Instance::0__map::0__ISBN::0__status::0"
  },
  {
    "uuid": "5e3dbdaa-9b6b-465d-b006-1c74db8df8de",
    "type": "group",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "5e3dbdaa-9b6b-465d-b006-1c74db8df8de"
    ],
    "displayName": "Notes about the Instance",
    "uri": "http://id.loc.gov/ontologies/bibframe/note",
    "uriBFLite": "_notes",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "children": ["aa3e74df-1b36-47b8-a27b-5d8c941370a6", "9f8e0e4a-82b9-4bd1-a4b7-e8b9d4bce546"],
    "htmlId": "Monograph::0__Instance::0__note::0"
  },
  {
    "uuid": "aa3e74df-1b36-47b8-a27b-5d8c941370a6",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "5e3dbdaa-9b6b-465d-b006-1c74db8df8de",
      "aa3e74df-1b36-47b8-a27b-5d8c941370a6"
    ],
    "displayName": "Note",
    "uri": "http://www.w3.org/2000/01/rdf-schema#label",
    "uriBFLite": "value",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__note::0__Note::0__note::0"
  },
  {
    "uuid": "9f8e0e4a-82b9-4bd1-a4b7-e8b9d4bce546",
    "type": "simple",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "5e3dbdaa-9b6b-465d-b006-1c74db8df8de",
      "9f8e0e4a-82b9-4bd1-a4b7-e8b9d4bce546"
    ],
    "displayName": "Note type",
    "uri": "http://id.loc.gov/ontologies/bibframe/noteType",
    "uriBFLite": "type",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/mnotetype"],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__note::0__Note::0__noteType::0"
  },
  {
    "uuid": "c49d71ba-aaf9-4f53-8d94-541b12af20c2",
    "type": "group",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "c49d71ba-aaf9-4f53-8d94-541b12af20c2"
    ],
    "displayName": "Supplementary Content note",
    "uri": "http://id.loc.gov/ontologies/bibframe/supplementaryContent",
    "uriBFLite": "http://bibfra.me/vocab/marc/supplementaryContent",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "children": ["03182444-49fb-40b4-a8e6-facd6642e2ba", "e2befed0-370b-4a9b-b3ff-985ed5d77f54"],
    "htmlId": "Monograph::0__Instance::0__supplementaryContent::0"
  },
  {
    "uuid": "03182444-49fb-40b4-a8e6-facd6642e2ba",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "c49d71ba-aaf9-4f53-8d94-541b12af20c2",
      "03182444-49fb-40b4-a8e6-facd6642e2ba"
    ],
    "displayName": "Note",
    "uri": "http://www.w3.org/2000/01/rdf-schema#label",
    "uriBFLite": "http://bibfra.me/vocab/lite/name",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__supplementaryContent::0__SupplementaryContent$$SupplContentNote::0__name::0"
  },
  {
    "uuid": "e2befed0-370b-4a9b-b3ff-985ed5d77f54",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "c49d71ba-aaf9-4f53-8d94-541b12af20c2",
      "e2befed0-370b-4a9b-b3ff-985ed5d77f54"
    ],
    "displayName": "URL for Supplementary Content",
    "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
    "uriBFLite": "http://bibfra.me/vocab/lite/link",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__supplementaryContent::0__SupplementaryContent$$SupplContentNote::0__link::0"
  },
  {
    "uuid": "b9401d74-ede6-4573-9c0d-46df374c0a2c",
    "type": "simple",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "b9401d74-ede6-4573-9c0d-46df374c0a2c"
    ],
    "displayName": "Media type",
    "uri": "http://id.loc.gov/ontologies/bibframe/media",
    "uriBFLite": "http://bibfra.me/vocab/marc/media",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/mediaTypes"],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Media"
      }
    },
    "htmlId": "Monograph::0__Instance::0__media::0"
  },
  /* {
    "uuid": "80d2bad5-ff0d-4204-b7ea-c224fbaa2a04",
    "type": "group",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "80d2bad5-ff0d-4204-b7ea-c224fbaa2a04"
    ],
    "displayName": "Extent",
    "uri": "http://id.loc.gov/ontologies/bibframe/extent",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "children": ["d67511ae-335d-4a87-99ca-6c17027171c0"],
    "htmlId": "Monograph::0__Instance::0__extent::0"
  }, */
  {
    "uuid": "d67511ae-335d-4a87-99ca-6c17027171c0",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      // "80d2bad5-ff0d-4204-b7ea-c224fbaa2a04",
      "d67511ae-335d-4a87-99ca-6c17027171c0"
    ],
    "displayName": "Extent",
    "uri": "http://www.w3.org/2000/01/rdf-schema#label",
    "uriBFLite": "http://bibfra.me/vocab/lite/extent",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__extent::0__BFLITE_URI_TEMP_EXTENT$$Extent::0__extent::0"
  },
  {
    "uuid": "bf793ffd-1630-4526-861a-bb9485cec5bc",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "bf793ffd-1630-4526-861a-bb9485cec5bc"
    ],
    "displayName": "Dimensions",
    "uri": "http://id.loc.gov/ontologies/bibframe/dimensions",
    "uriBFLite": "http://bibfra.me/vocab/marc/dimensions",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__dimensions::0"
  },
  {
    "uuid": "bf793ffd-1630-4526-861a-bb9485cec5bc1",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "bf793ffd-1630-4526-861a-bb9485cec5bc1"
    ],
    "displayName": "Dimensions",
    "uri": "http://id.loc.gov/ontologies/bibframe/dimensions",
    "uriBFLite": "http://bibfra.me/vocab/marc/dimensions",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__dimensions::0"
  },
  {
    "uuid": "ad763206-75f3-467b-8539-034182eec383",
    "type": "simple",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "ad763206-75f3-467b-8539-034182eec383"
    ],
    "displayName": "Carrier type",
    "uri": "http://id.loc.gov/ontologies/bibframe/carrier",
    "uriBFLite": "http://bibfra.me/vocab/marc/carrier",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/carriers"],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Carrier"
      }
    },
    "htmlId": "Monograph::0__Instance::0__carrier::0"
  },
  {
    "uuid": "a3efd7ed-0d62-4f8f-9133-c4ef4d348271",
    "type": "group",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "a3efd7ed-0d62-4f8f-9133-c4ef4d348271"
    ],
    "displayName": "URL of Instance",
    "uri": "http://id.loc.gov/ontologies/bibframe/electronicLocator",
    "uriBFLite": "http://bibfra.me/vocab/marc/accessLocation",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "children": ["8045b8b7-13ab-48d5-b7dd-0fae09a67795", "1efb38fa-33f2-4482-94b8-01c07891d6a2"],
    "htmlId": "Monograph::0__Instance::0__accessLocation::0"
  },
  {
    "uuid": "8045b8b7-13ab-48d5-b7dd-0fae09a67795",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "a3efd7ed-0d62-4f8f-9133-c4ef4d348271",
      "8045b8b7-13ab-48d5-b7dd-0fae09a67795"
    ],
    "displayName": "URL",
    "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
    "uriBFLite": "http://bibfra.me/vocab/lite/link",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__accessLocation::0__rdf-schema#Resource$$URL::0__link::0"
  },
  {
    "uuid": "1efb38fa-33f2-4482-94b8-01c07891d6a2",
    "type": "group",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "a3efd7ed-0d62-4f8f-9133-c4ef4d348271",
      "1efb38fa-33f2-4482-94b8-01c07891d6a2"
    ],
    "displayName": "Note",
    "uri": "http://id.loc.gov/ontologies/bibframe/note",
    "uriBFLite": "http://bibfra.me/vocab/lite/note",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "children": ["a2b1ac86-a763-422d-955b-50f2916db120"],
    "htmlId": "Monograph::0__Instance::0__accessLocation::0__rdf-schema#Resource$$URL::0__note::0"
  },
  {
    "uuid": "a2b1ac86-a763-422d-955b-50f2916db120",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "f66de7a5-50b2-43d3-93b9-43b5f0e06433",
      "a3efd7ed-0d62-4f8f-9133-c4ef4d348271",
      "1efb38fa-33f2-4482-94b8-01c07891d6a2",
      "a2b1ac86-a763-422d-955b-50f2916db120"
    ],
    "displayName": "Note",
    "uri": "http://www.w3.org/2000/01/rdf-schema#label",
    "uriBFLite": "http://bibfra.me/vocab/lite/note",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Instance::0__accessLocation::0__rdf-schema#Resource$$URL::0__note::0__Note$$NoteSimple::0__note::0"
  },
  {
    "uuid": "6649f36c-d0c5-4ee9-9980-fd13e667fa7a",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5ae8ebb0-ea06-42e5-8377-f0a5c11543b2",
      "6649f36c-d0c5-4ee9-9980-fd13e667fa7a"
    ],
    "displayName": "Library of Congress Classification",
    "bfid": "lc:RT:bf2:LCC",
    "uri": "http://id.loc.gov/ontologies/bibframe/ClassificationLcc",
    "uriBFLite": "lc",
    "children": [
      "25b5151a-0489-4bc0-b737-b50ee087192f",
      "a734e011-bbb3-4e1d-b8f9-c932a080913d",
      "6af54fa2-6a69-4643-b3b2-4eef7a4eb0d8",
      "fed1557c-ab28-4089-bbae-0973bf0f600a"
    ],
    "htmlId": "Monograph::0__Work::0__classification::1__lc$$LCC::0"
  },
  {
    "uuid": "25b5151a-0489-4bc0-b737-b50ee087192f",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5ae8ebb0-ea06-42e5-8377-f0a5c11543b2",
      "6649f36c-d0c5-4ee9-9980-fd13e667fa7a",
      "25b5151a-0489-4bc0-b737-b50ee087192f"
    ],
    "displayName": "Classification number",
    "uri": "http://id.loc.gov/ontologies/bibframe/classificationPortion",
    "uriBFLite": "http://bibfra.me/vocab/marc/code",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__classification::1__lc$$LCC::0__code::0",
    "children": []
  },
  {
    "uuid": "a734e011-bbb3-4e1d-b8f9-c932a080913d",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5ae8ebb0-ea06-42e5-8377-f0a5c11543b2",
      "6649f36c-d0c5-4ee9-9980-fd13e667fa7a",
      "a734e011-bbb3-4e1d-b8f9-c932a080913d"
    ],
    "displayName": "Additional call number information",
    "uri": "http://id.loc.gov/ontologies/bibframe/itemPortion",
    "uriBFLite": "http://bibfra.me/vocab/marc/itemNumber",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__classification::1__lc$$LCC::0__itemNumber::0",
    "children": []
  },
  {
    "uuid": "6af54fa2-6a69-4643-b3b2-4eef7a4eb0d8",
    "type": "complex",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5ae8ebb0-ea06-42e5-8377-f0a5c11543b2",
      "6649f36c-d0c5-4ee9-9980-fd13e667fa7a",
      "6af54fa2-6a69-4643-b3b2-4eef7a4eb0d8"
    ],
    "displayName": "Assigning agency",
    "uri": "http://id.loc.gov/ontologies/bibframe/assigner",
    "uriBFLite": "_assigningSourceReference",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/organizations"],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Agent"
      }
    },
    "htmlId": "Monograph::0__Work::0__classification::1__lc$$LCC::0___assigningSourceReference::0",
    "children": []
  },
  {
    "uuid": "fed1557c-ab28-4089-bbae-0973bf0f600a",
    "type": "simple",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5ae8ebb0-ea06-42e5-8377-f0a5c11543b2",
      "6649f36c-d0c5-4ee9-9980-fd13e667fa7a",
      "fed1557c-ab28-4089-bbae-0973bf0f600a"
    ],
    "displayName": "Used by assigning agency?",
    "uri": "http://id.loc.gov/ontologies/bibframe/status",
    "uriBFLite": "http://bibfra.me/vocab/marc/status",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/mstatus"],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Status"
      }
    },
    "htmlId": "Monograph::0__Work::0__classification::1__lc$$LCC::0__status::0",
    "children": []
  },
  {
    "uuid": "1e908830-f60a-4e71-b634-bd04c8313662",
    "type": "dropdownOption",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5ae8ebb0-ea06-42e5-8377-f0a5c11543b2",
      "1e908830-f60a-4e71-b634-bd04c8313662"
    ],
    "displayName": "Dewey Decimal Classification",
    "bfid": "lc:RT:bf2:DDC",
    "uri": "http://id.loc.gov/ontologies/bibframe/ClassificationDdc",
    "uriBFLite": "ddc",
    "children": [
      "412345b4-4667-478d-9bfc-4c70f62a70a4",
      "a108885d-a0d0-4ae2-a246-492b33a52584",
      "cd5d7c6a-2df8-4e0e-9f0a-58d0cee4db4e",
      "e1d05afa-48b6-4847-a912-21657e02a390",
      "679053f5-0e3f-49e4-9260-b9ea326212a5"
    ],
    "htmlId": "Monograph::0__Work::0__classification::1__ddc$$DDC::0"
  },
  {
    "uuid": "412345b4-4667-478d-9bfc-4c70f62a70a4",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5ae8ebb0-ea06-42e5-8377-f0a5c11543b2",
      "1e908830-f60a-4e71-b634-bd04c8313662",
      "412345b4-4667-478d-9bfc-4c70f62a70a4"
    ],
    "displayName": "Classification number",
    "uri": "http://id.loc.gov/ontologies/bibframe/classificationPortion",
    "uriBFLite": "http://bibfra.me/vocab/marc/code",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__classification::1__ddc$$DDC::0__code::0",
    "children": []
  },
  {
    "uuid": "a108885d-a0d0-4ae2-a246-492b33a52584",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5ae8ebb0-ea06-42e5-8377-f0a5c11543b2",
      "1e908830-f60a-4e71-b634-bd04c8313662",
      "a108885d-a0d0-4ae2-a246-492b33a52584"
    ],
    "displayName": "Additional call number information",
    "uri": "http://id.loc.gov/ontologies/bibframe/itemPortion",
    "uriBFLite": "http://bibfra.me/vocab/marc/itemNumber",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__classification::1__ddc$$DDC::0__itemNumber::0",
    "children": []
  },
  {
    "uuid": "cd5d7c6a-2df8-4e0e-9f0a-58d0cee4db4e",
    "type": "group",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5ae8ebb0-ea06-42e5-8377-f0a5c11543b2",
      "1e908830-f60a-4e71-b634-bd04c8313662",
      "cd5d7c6a-2df8-4e0e-9f0a-58d0cee4db4e"
    ],
    "displayName": "Dewey Edition number",
    "uri": "http://id.loc.gov/ontologies/bibframe/source",
    "uriBFLite": "http://bibfra.me/vocab/marc/edition",
    "constraints": {
      "repeatable": true,
      "editable": true,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": { "dataTypeURI": "" }
    },
    "children": ["659808ab-8d26-4ebc-86c9-2632e8800f59"],
    "htmlId": "Monograph::0__Work::0__classification::1__ddc$$DDC::0__edition::0"
  },
  {
    "uuid": "659808ab-8d26-4ebc-86c9-2632e8800f59",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5ae8ebb0-ea06-42e5-8377-f0a5c11543b2",
      "1e908830-f60a-4e71-b634-bd04c8313662",
      "cd5d7c6a-2df8-4e0e-9f0a-58d0cee4db4e",
      "659808ab-8d26-4ebc-86c9-2632e8800f59"
    ],
    "displayName": "Dewey Edition number",
    "uri": "http://id.loc.gov/ontologies/bibframe/code",
    "uriBFLite": "http://bibfra.me/vocab/marc/editionNumber",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__classification::1__ddc$$DDC::0__edition::0__Source$$DDCEdNum::0__editionNumber::0",
    "children": []
  },
  {
    "uuid": "e1d05afa-48b6-4847-a912-21657e02a390",
    "type": "literal",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5ae8ebb0-ea06-42e5-8377-f0a5c11543b2",
      "1e908830-f60a-4e71-b634-bd04c8313662",
      "e1d05afa-48b6-4847-a912-21657e02a390"
    ],
    "displayName": "Dewey full or abridged?",
    "uri": "http://id.loc.gov/ontologies/bibframe/edition",
    "uriBFLite": "http://bibfra.me/vocab/marc/edition",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "htmlId": "Monograph::0__Work::0__classification::1__ddc$$DDC::0__edition::0",
    "children": []
  },
  {
    "uuid": "679053f5-0e3f-49e4-9260-b9ea326212a5",
    "type": "complex",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5ae8ebb0-ea06-42e5-8377-f0a5c11543b2",
      "1e908830-f60a-4e71-b634-bd04c8313662",
      "679053f5-0e3f-49e4-9260-b9ea326212a5"
    ],
    "displayName": "Assigner",
    "uri": "http://id.loc.gov/ontologies/bibframe/assigner",
    "uriBFLite": "_assigningSourceReference",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": ["http://id.loc.gov/vocabulary/organizations"],
      "valueDataType": {
        "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Agent"
      }
    },
    "htmlId": "Monograph::0__Work::0__classification::1__ddc$$DDC::0___assigningSourceReference::0",
    "children": []
  },
  {
    "uuid": "5ae8ebb0-ea06-42e5-8377-f0a5c11543b2",
    "type": "dropdown",
    "path": [
      "ade54fa5-c456-4884-9996-241c913d1e6d",
      "dfcd5049-ace6-4e8c-9405-d83128dfa6cb",
      "5ae8ebb0-ea06-42e5-8377-f0a5c11543b2"
    ],
    "displayName": "Classification numbers",
    "uri": "http://id.loc.gov/ontologies/bibframe/classification",
    "uriBFLite": "http://bibfra.me/vocab/lite/classification",
    "constraints": {
      "repeatable": true,
      "editable": false,
      "mandatory": true,
      "defaults": [],
      "useValuesFrom": [],
      "valueDataType": {}
    },
    "children": ["6649f36c-d0c5-4ee9-9980-fd13e667fa7a", "1e908830-f60a-4e71-b634-bd04c8313662"],
    "htmlId": "Monograph::0__Work::0__classification::1",
    "deletable": true,
    "cloneIndex": 1
  }
]
