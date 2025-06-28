import { initiateUserAgentDownload } from "@common/helpers/download.helper";

describe('download.helper', () => {
  describe('initiateUserAgentDownload', () => {
    window.URL.createObjectURL = jest.fn();
    window.URL.revokeObjectURL = jest.fn();
    
    test('anchor element created', () => {
      jest.spyOn(document.body, 'appendChild');
      initiateUserAgentDownload(new Blob(['']), 'any');
      expect(document.body.appendChild).toHaveBeenCalledWith(
        expect.objectContaining({
          download: 'any',
        })
      );
    });
  });
});