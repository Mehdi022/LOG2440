import songs from "../../src/assets/js/songs";
import playlists from "../../src/assets/js/playlists";
import StorageManager from "../../src/assets/js/storageManager.js";

describe("StorageManager tests", () => {
  const assignMock = jest.fn();
  const clearHTML = () => (document.body.innerHTML = "");
  let storageManager;

  const setUpHTML = () => {};

  beforeEach(() => {
    delete window.location;
    window.location = { assign: assignMock };
    setUpHTML();
    storageManager = new StorageManager();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    assignMock.mockClear();
    clearHTML();
    localStorage.clear();
  });

  it("Storage manager should be created", () => {
    expect(storageManager).not.toEqual(null);
  });

  it("loadAllData should correctly call loadDataFromFile for both files", () => {
    const storageManagerLoadDataFromFileSpy = jest.spyOn(storageManager, 'loadDataFromFile').mockImplementation(() => {});
    storageManager.loadAllData();
    expect(storageManagerLoadDataFromFileSpy).toHaveBeenCalledTimes(2);
    const expectedStorageKeySong = "songs";
    const expectedStorageKeyPlaylists = "playlist";
    expect(storageManagerLoadDataFromFileSpy).toHaveBeenCalledWith(expectedStorageKeySong, songs);
    expect(storageManagerLoadDataFromFileSpy).toHaveBeenCalledWith(expectedStorageKeyPlaylists, playlists);
  });

  it("loadDataFromFile should not reload data if data is already contained in localStorage", () => {
    const defaultKey = "key";
    localStorage.setItem(defaultKey, JSON.stringify(defaultKey));
    const localStorageGetItemSpy = jest.spyOn(localStorage.__proto__, 'getItem');
    const localStorageSetItemSpy = jest.spyOn(localStorage.__proto__, 'setItem');
    storageManager.loadDataFromFile(defaultKey);
    expect(JSON.parse(localStorage.getItem(defaultKey))).toEqual(defaultKey);
    expect(localStorageGetItemSpy).toBeCalled();
    expect(localStorageGetItemSpy).toHaveBeenCalledWith(defaultKey);
    expect(localStorageSetItemSpy).not.toBeCalled();
  });

  it("loadDataFromFile should load data if data is not already contained in localStorage", () => {
    // TODO
    const key = "key";
    const data = "data";
    const localStorageGetItemSpy = jest.spyOn(localStorage.__proto__, 'getItem');
    const localStorageSetItemSpy = jest.spyOn(localStorage.__proto__, 'setItem');
    storageManager.loadDataFromFile(key, data);
    expect(JSON.parse(localStorage.getItem(key))).toEqual(data);
    expect(localStorageGetItemSpy).toBeCalled();
    expect(localStorageGetItemSpy).toHaveBeenCalledWith(key);
    expect(localStorageSetItemSpy).toBeCalled();
    expect(localStorageSetItemSpy).toHaveBeenCalledWith(key, JSON.stringify(data));
  });

  it("getData should not get localStorage's data given an invalid storageKey", () => {
    expect(storageManager.getData(undefined)).toBeFalsy();
  });

  it("getData should get localStorage's data given a valid storageKey", () => {
    const defaultKey = "key";
    const localStorageGetItemSpy = jest.spyOn(localStorage.__proto__, 'getItem');
    localStorage.setItem(defaultKey, JSON.stringify(defaultKey));
    // TODO compléter le teste avec cette configuration
    expect(storageManager.getData(defaultKey)).toEqual(defaultKey);
    expect(localStorageGetItemSpy).toBeCalled();
    expect(localStorageGetItemSpy).toHaveBeenCalledWith(defaultKey);
  });

  it("getItemById should call getData", () => {
    const defaultKey = "key";
    const storageManagerGetDataSpy = jest.spyOn(storageManager, 'getData').mockImplementation(() => []);
    storageManager.getItemById(defaultKey, undefined);
    expect(storageManagerGetDataSpy).toBeCalled();
    expect(storageManagerGetDataSpy).toHaveBeenCalledWith(defaultKey);
  });

  it("getItemById should find item with specific id", () => {
    // TODO
    const key = "key";
    const id = "id";
    const data = [{id: id}];
    const storageManagerGetDataSpy = jest.spyOn(storageManager, 'getData').mockImplementation(() => data);
    expect(storageManager.getItemById(key, id)).toEqual(data[0]);
    expect(storageManagerGetDataSpy).toBeCalled();
    expect(storageManagerGetDataSpy).toHaveBeenCalledWith(key);
  });

  it("addItem should correctly add an item to localStorage", () => {
    const storageKey = null;
    const newItem = undefined;
    const localStorageGetItemSpy = jest.spyOn(localStorage.__proto__, 'getItem').mockImplementation(() => JSON.stringify([{ newItem }]));
    const localStorageSetItemSpy = jest.spyOn(localStorage.__proto__, 'setItem').mockImplementation(() => {});
    storageManager.addItem(storageKey, newItem);
    expect(localStorageGetItemSpy).toBeCalled();
    expect(localStorageGetItemSpy).toHaveBeenCalledWith(storageKey);
    expect(localStorageSetItemSpy).toBeCalled();
    expect(localStorageSetItemSpy).toHaveBeenCalledWith(storageKey, JSON.stringify([{ newItem }, storageKey]));
  });

  it("replaceItem should correctly replace an item in localStorage with id checks", () => {
    // TODO
    const key = "key";
    const item = {id: "id"};
    const localStorageGetItemSpy = jest.spyOn(localStorage.__proto__, 'getItem').mockImplementation(() => JSON.stringify([{ item }]));
    const localStorageSetItemSpy = jest.spyOn(localStorage.__proto__, 'setItem').mockImplementation(() => {});
    storageManager.replaceItem(key, item);
    expect(localStorageGetItemSpy).toBeCalled();
    expect(localStorageGetItemSpy).toHaveBeenCalledWith(key);
    expect(localStorageSetItemSpy).toBeCalled();
    expect(localStorageSetItemSpy).toHaveBeenCalledWith(key, JSON.stringify([{ item }]));
  });

  it("replaceItem should call getItem & setItem", () => {
    const storageKey = null;
    const newItem = undefined;
    const localStorageGetItemSpy = jest.spyOn(localStorage.__proto__, 'getItem').mockImplementation(() => JSON.stringify([]));
    const localStorageSetItemSpy = jest.spyOn(localStorage.__proto__, 'setItem').mockImplementation(() => {});
    storageManager.replaceItem(storageKey, newItem);
    expect(localStorageGetItemSpy).toBeCalled();
    expect(localStorageSetItemSpy).toBeCalled();
  });

  it("getIdFromName should call getData", () => {
    // TODO
    const storageKey = null;
    const storageName = undefined;
    const storageManagerGetDataSpy = jest.spyOn(storageManager, 'getData').mockImplementation(() => []);
    storageManager.getIdFromName(storageKey, storageName);
    expect(storageManagerGetDataSpy).toBeCalled();
    expect(storageManagerGetDataSpy).toHaveBeenCalledWith(storageKey);
  });

  it("getIdFromName should return a valid id given a valid elementName", () => {
    const elementName = "elementName";
    const expectedId = 0;
    jest.spyOn(storageManager, 'getData').mockImplementation(() => [{ name: elementName, id: expectedId }]);
    expect(storageManager.getIdFromName("key", elementName)).toEqual(expectedId);
  });

  it("getIdFromName should return -1 given an invalid elementName", () => {
    // TODO
    const elementName = "elementName";
    const expectedId = -1;
    jest.spyOn(storageManager, 'getData').mockImplementation(() => [{ name: elementName, id: expectedId }]);
    expect(storageManager.getIdFromName("key", elementName)).toEqual(expectedId);
  });

  it("resetAllData should reset localStorage", () => {
    const storageKey = "key";
    const data = { id: undefined };
    localStorage.setItem(storageKey, JSON.stringify(data));
    storageManager.resetAllData();
    const result = JSON.parse(localStorage.getItem(storageKey));
    expect(result).toEqual(null);
  });
});
