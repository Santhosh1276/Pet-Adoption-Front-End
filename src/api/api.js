/* eslint-disable no-unused-vars */

let API = "https://pet-adoption-service.onrender.com/api"
let token = localStorage.getItem("accessToken");
let current_user_id = localStorage.getItem("user_id")

export const fetchMessages = async () => {
    try {
        const response = await fetch(`${API}/messages/${current_user_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": token
            },
        });
        if (!response.ok) throw new Error("Failed to fetch messages");
        return await response.json();
    } catch (error) {
        console.error("Error fetching messages:", error);
        throw error;
    }
};

export const fetchShelters = async () => {
    try {
        const response = await fetch(`${API}/auth/shelters`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": token
            },
        });
        if (!response.ok) throw new Error("Failed to fetch shelters");
        return await response.json();
    } catch (error) {
        console.error("Error fetching shelters:", error);
        throw error;
    }
};


export const fetchAllUsers = async () => {
    try {
        const response = await fetch(`${API}/auth/all-users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": token
            },
        });
        if (!response.ok) throw new Error("Failed to fetch Users");
        return await response.json();
    } catch (error) {
        console.error("Error fetching Users:", error);
        throw error;
    }
};



export const sendMessage = async (senderId, receiverId, message) => {
    console.log("params  >>>>", senderId, receiverId, message)

    const response = await fetch(`${API}/messages/send`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        },
        body: JSON.stringify({ senderId, receiverId, message }),
    });
    console.log("response >>>>",response)
    return response.json();
};

//----------------------Pet Form--------------------------------------
export async function submitPetForm(data) {
    console.log("data >>>", data)
    let jsonData = {
        ...data,
        shelterId :current_user_id
    }
   return await fetch(`${API}/pets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token":token
        },
       body: JSON.stringify(jsonData),
        
    })
}

export async function getAllPets() {
    return await fetch(`${API}/pets`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token

        },
    })
}

export async function getPetsByFilter(filters) {
    // Remove null or undefined values
    const filteredFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value != null)
    );
     
    console.log("filtered filters", filteredFilters)

    // Convert object to query string
    const queryString = new URLSearchParams(filteredFilters).toString();
    console.log("querey string >>>>",queryString)

    // Construct the URL with query parameters
    const url = `${API}/pets/filter?${queryString}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": token
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch pets");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching pets:", error);
        return { error: "Failed to fetch pets" };
    }
}

// delete pet
export async function deletePetById(petId) {
    return await fetch(`${API}/pets/${petId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        },
    })
}



export async function getPetsByShelterId() {
    return await fetch(`${API}/pets/shelter/${current_user_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        },
    })
}

export async function getPetsByShelterId_fostering() {
    return await fetch(`${API}/pets/shelter_fostering/${current_user_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        },
    })
}


export async function getPetsByFosterId() {
    return await fetch(`${API}/pets/foster/${current_user_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        },
    })
}


export async function getPetsByAdopterId() {
    return await fetch(`${API}/pets/adopter/${current_user_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        },
    })
}

export async function setFavoritesPet(pet , userId) {
    return await fetch(`${API}/pets/${pet._id}/favorite`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", 
            "x-auth-token": token

         },
        body: JSON.stringify({ userId }),
    });
}

export const getFavorites = async (userId) => {
    const response = await fetch(`${API}/pets/favorites/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token

        },
    });
    return response.json();
};

export async function getPetById(petId) {
    return await fetch(`${API}/pets/${petId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        },
    })
}



export async function applyNewAdoption(data) {
    return await fetch(`${API}/adoptions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        },
        body: JSON.stringify(data)
    })
}


export async function getDataByUserId(userId, user_role) {
    return await fetch(`${API}/adoptions?userId=${userId}&user_role=${user_role}`, {  
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        }
    });
}

// for updating and deleting the fostering
export async function updatePetForFostering(shelterId,data) {
    return await fetch(`${API}/pets/${shelterId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        },
        body:JSON.stringify(data)
    })
}

export async function deletePetForFostering(petId) {
    return await fetch(`${API}/foster/${petId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        },
    })
}


// for adoption updating & deleting
export async function updatePetForAdoption(shelterId, data) {
    return await fetch(`${API}/pets/adop/${shelterId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        },
        body: JSON.stringify(data)
    })
}

export async function deletePetForAdoption(petId) {
    return await fetch(`${API}/adoptions/${petId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        },
    })
}


export const addReview = async (petId, reviewData) => {
    return fetch(`${API}/pets/${petId}/review`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        },
        body: JSON.stringify(reviewData)
    });
};



// -----------------------User Api----------------------------------
export async function login_api(email, password) {
    return await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token

        },
        body: JSON.stringify({email,password}),
    })
}

export async function signUp_api(data) {
    return await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
            'Content-type':"application/json"
        },
        body:JSON.stringify(data)
    })
}


export async function updateUserDetails(data) {
    return await fetch(`${API}/auth/update-profile/${current_user_id}`, {
        method: "PUT",
        headers: {
            'Content-type': "application/json"
        },
        body: JSON.stringify(data)
    })
}


// ----------------------------Foster-----------------------------------------------

export async function applyNewFoster(data) {
    return await fetch(`${API}/foster`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        },
        body: JSON.stringify(data)
    })
}

// -------------------------Mail Function---------------------------------------------------------
export async function sendMail(data) {
    console.log("token >>>",token,data)
    console.log("Data >>>", data);

    const response = await fetch(`${API}/generate-mail`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response
} 

export async function approveOrRejectMail(data) {
    console.log("token >>>", token, data)
    console.log("Data >>>", data);

    const response = await fetch(`${API}/generate-mail/accept-reject`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response
}