import axios from "axios";
import simulatedDatabase from "../api/lists";

const BASE_URL = "http://localhost:3000";
const USE_MOCK = process.env.REACT_APP_USE_MOCK === "true";

//Mock funkce

const hasAccessToList = (user, list) => {
  return (
    user &&
    (list.ownerID === user.userId ||
      list.members.some((m) => m.userId === user.userId))
  );
};

const isOwner = (user, list) => {
  return user && list.ownerID === user.userId;
};

const updateMockListName = async (listId, newListName, user) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const list = simulatedDatabase.find((list) => list.listId === listId);
      if (!list) {
        return reject(new Error("List not found."));
      }
      if (list.ownerID !== user.userId) {
        return reject(new Error("Permission denied."));
      }
      list.listName = newListName;
      resolve(list);
    }, 500);
  });
};

const fetchMockLists = async (user) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const accessibleLists = simulatedDatabase.filter(
        (list) => hasAccessToList(user, list) && !list.isArchived
      );
      resolve(accessibleLists);
    }, 500);
  });
};

const createMockList = async (newList, user) => {
  console.log("Mock create list called with:", newList, "by user:", user);
  return new Promise((resolve) => {
    setTimeout(() => {
      const listWithOwner = {
        ...newList,
        listId: simulatedDatabase.length + 1,
        ownerID: user.userId,
        members: [
          { userId: user.userId, userName: user.userName, role: "owner" },
        ],
        isArchived: false,
        items: [],
      };
      simulatedDatabase.push(listWithOwner);
      console.log("List added to simulated database:", listWithOwner);
      resolve(listWithOwner);
    }, 500);
  });
};

const deleteMockList = async (listId, user) => {
  console.log("Mock delete called for list ID:", listId, "by user:", user);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const list = simulatedDatabase.find((list) => list.listId === listId);
      if (!list) {
        console.log("List not found.");
        return reject(new Error("List not found."));
      }
      if (!isOwner(user, list)) {
        console.log("User is not the owner of the list.");
        return reject(new Error("Permission denied."));
      }

      simulatedDatabase.splice(
        simulatedDatabase.findIndex((l) => l.listId === listId),
        1
      );
      console.log("List deleted successfully.");
      resolve();
    }, 500);
  });
};

const fetchMockMembers = async (listId) => {
  const list = simulatedDatabase.find((list) => list.listId === listId);
  return new Promise((resolve) => {
    setTimeout(() => resolve(list?.members || []), 500);
  });
};

const addMockMember = async (listId, member, user) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const list = simulatedDatabase.find((list) => list.listId === listId);

      if (!list) {
        return reject(new Error("List not found."));
      }

      if (list.ownerID !== user.userId) {
        return reject(new Error("Permission denied."));
      }

      const isDuplicate = list.members.some(
        (existingMember) =>
          existingMember.userName.toLowerCase() ===
          member.userName.toLowerCase()
      );
      if (isDuplicate) {
        return reject(new Error("Member already exists."));
      }

      const newMember = { ...member, role: "member" };
      list.members.push(newMember);
      resolve(newMember);
    }, 500);
  });
};

const deleteMockMember = async (listId, memberId, user) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const list = simulatedDatabase.find((list) => list.listId === listId);
      if (!list || (!isOwner(user, list) && user.userId !== memberId)) {
        return reject(new Error("Permission denied."));
      }

      list.members = list.members.filter((m) => m.userId !== memberId);
      resolve(list.members);
    }, 500);
  });
};

const updateMockOwner = async (listId, newOwnerId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const list = simulatedDatabase.find((list) => list.listId === listId);
      if (list) {
        list.ownerID = newOwnerId;
        resolve(list);
      }
    }, 500);
  });
};

const addMockItem = async (listId, item, user) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const list = simulatedDatabase.find((list) => list.listId === listId);
      if (!list || !hasAccessToList(user, list)) {
        return reject(new Error("Permission denied."));
      }

      const existingItem = list.items.find(
        (existing) => existing.name.toLowerCase() === item.name.toLowerCase()
      );

      if (existingItem) {
        existingItem.amount += item.amount;
      } else {
        list.items.push(item);
      }
      resolve(list.items);
    }, 500);
  });
};

const updateMockItem = async (listId, itemId, updatedData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const list = simulatedDatabase.find((list) => list.listId === listId);
      if (list) {
        const itemIndex = list.items.findIndex((item) => item.name === itemId);
        if (itemIndex !== -1) {
          list.items[itemIndex] = { ...list.items[itemIndex], ...updatedData };
        }
        resolve(list.items[itemIndex]);
      }
    }, 500);
  });
};

const deleteMockItem = async (listId, itemId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const list = simulatedDatabase.find((list) => list.listId === listId);
      if (list) {
        list.items = list.items.filter((item) => item.name !== itemId);
      }
      resolve();
    }, 500);
  });
};

const archiveMockList = async (listId, user) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const list = simulatedDatabase.find((list) => list.listId === listId);
      if (!list || list.ownerID !== user.userId) {
        return reject(new Error("Permission denied."));
      }
      list.isArchived = true;
      resolve(list);
    }, 500);
  });
};

//Serverové funkce

const handleApiCall = async (apiCall) => {
  const state = { status: "pending", data: null, error: null };
  try {
    const data = await apiCall();
    state.status = "ready";
    state.data = data;
  } catch (error) {
    state.status = "error";
    state.error = error.response?.data || error.message;
  }
  return state;
};

const updateServerListName = async (listId, newListName) => {
  return await handleApiCall(async () => {
    const response = await axios.put(`${BASE_URL}/lists/${listId}/name`, {
      listName: newListName,
    });
    return response.data;
  });
};

const fetchServerLists = async () => {
  return await handleApiCall(async () => {
    const response = await axios.get(`${BASE_URL}/lists`);
    return response.data;
  });
};

const createServerList = async (newList) => {
  return await handleApiCall(async () => {
    const response = await axios.post(`${BASE_URL}/lists`, newList);
    return response.data;
  });
};

const deleteServerList = async (listId) => {
  return await handleApiCall(async () => {
    const response = await axios.delete(`${BASE_URL}/lists/${listId}`);
    return response.data;
  });
};

const fetchServerMembers = async (listId) => {
  return await handleApiCall(async () => {
    const response = await axios.get(`${BASE_URL}/lists/${listId}/members`);
    return response.data;
  });
};

const addServerMember = async (listId, member) => {
  return await handleApiCall(async () => {
    const response = await axios.post(
      `${BASE_URL}/lists/${listId}/members`,
      member
    );
    return response.data;
  });
};

const deleteServerMember = async (listId, memberId) => {
  return await handleApiCall(async () => {
    const response = await axios.delete(
      `${BASE_URL}/lists/${listId}/members/${memberId}`
    );
    return response.data;
  });
};

const updateServerOwner = async (listId, newOwnerId) => {
  return await handleApiCall(async () => {
    const response = await axios.put(`${BASE_URL}/lists/${listId}/owner`, {
      ownerId: newOwnerId,
    });
    return response.data;
  });
};

const addServerItem = async (listId, item) => {
  return await handleApiCall(async () => {
    const response = await axios.post(
      `${BASE_URL}/lists/${listId}/items`,
      item
    );
    return response.data;
  });
};

const updateServerItem = async (listId, itemId, updatedData) => {
  return await handleApiCall(async () => {
    const response = await axios.put(
      `${BASE_URL}/lists/${listId}/items/${itemId}`,
      updatedData
    );
    return response.data;
  });
};

const deleteServerItem = async (listId, itemId) => {
  return await handleApiCall(async () => {
    const response = await axios.delete(
      `${BASE_URL}/lists/${listId}/items/${itemId}`
    );
    return response.data;
  });
};

const archiveServerList = async (listId) => {
  return await handleApiCall(async () => {
    const response = await axios.put(`${BASE_URL}/lists/${listId}/archive`);
    return response.data;
  });
};


export const fetchLists = (user) =>
  USE_MOCK ? fetchMockLists(user) : fetchServerLists();

export const createList = USE_MOCK ? createMockList : createServerList;
export const deleteList = USE_MOCK ? deleteMockList : deleteServerList;

export const fetchMembers = USE_MOCK ? fetchMockMembers : fetchServerMembers;
export const addMember = USE_MOCK ? addMockMember : addServerMember;
export const deleteMember = USE_MOCK ? deleteMockMember : deleteServerMember;

export const updateOwner = USE_MOCK ? updateMockOwner : updateServerOwner;

export const addItemToList = USE_MOCK ? addMockItem : addServerItem;
export const updateItem = USE_MOCK ? updateMockItem : updateServerItem;
export const deleteItem = USE_MOCK ? deleteMockItem : deleteServerItem;

export const archiveList = USE_MOCK ? archiveMockList : archiveServerList;
export const updateListName = USE_MOCK
  ? updateMockListName
  : updateServerListName;
