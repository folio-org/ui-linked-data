import './common/helpers/env.helper.mock';
import './lib/intl.mock';
// TODO: delete this after deleting "IS_NEW_SCHEMA_BUILDING_ALGORITHM_ENABLED" feature variable
import { getMockedImportedConstant } from './common/constants/constants.mock';
import * as FeatureConstants from '@common/constants/feature.constants';

const mockImportedConstant = getMockedImportedConstant(FeatureConstants, 'IS_NEW_SCHEMA_BUILDING_ALGORITHM_ENABLED');
mockImportedConstant(false);
