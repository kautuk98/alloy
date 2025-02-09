/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { string, boolean } from "../../utils/configValidators";

export default () => {
  return {
    propertyId: {
      validate: string().unique()
    },
    edgeDomain: {
      defaultValue: "alpha.konductor.adobedc.net",
      validate: string().domain()
    },
    imsOrgId: {
      validate: string().unique()
    },
    clickCollectionEnabled: {
      defaultValue: true,
      validate: boolean()
    },
    downloadLinkQualifier: {
      defaultValue:
        "\\.(exe|zip|wav|mp3|mov|mpg|avi|wmv|pdf|doc|docx|xls|xlsx|ppt|pptx)$",
      validate: string().regexp()
    }
  };
};
