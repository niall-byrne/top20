import PersistenceVendorBaseClass from "@src/backend/integrations/persistence/client/bases/persistence.base.client.class";
import type {
  PersistenceVendorDataType,
  PersistenceVendorClientHeadersInterface,
} from "@src/types/integrations/persistence/vendor.types";

export default class MockConcretePersistenceVendor extends PersistenceVendorBaseClass {
  protected async writeImplementation(
    keyName: string,
    data: PersistenceVendorDataType,
    headers: PersistenceVendorClientHeadersInterface
  ): Promise<void> {
    mockPersistenceClient(keyName, data, headers);
  }
}

export const mockPersistenceClient = jest.fn();
