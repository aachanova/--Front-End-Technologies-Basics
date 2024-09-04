let baseUrl = 'http://localhost:3030/';

let user = {
    email: "",
    password: "123456"
};

let token = "";
let userId = "";

let pet = {
    age: "2 years",
    name: "",
    breed: "",
    image: "/images/cat-create.jpg",
    weight: "2 kg"
};

let lastCreatedPetId = "";


QUnit.config.reorder = false;

QUnit.module("user functionalities", () => {
    QUnit.test("registration", async (assert) => {
        let path = "users/register";

        let random = Math.floor(Math.random() * 10000);

        let email = `email${random}abv.bg`;
        user.email = email;

        let response = await fetch(baseUrl + path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        assert.ok(response.ok, "successful response");

        let json = await response.json();
        console.log(json);

        assert.ok(json.hasOwnProperty("email"), "email exist");
        assert.strictEqual(json.email, user.email, "expected email");
        assert.strictEqual(typeof json.email, "string", "correct type");

        assert.ok(json.hasOwnProperty("password"), "password exist");
        assert.strictEqual(json.password, user.password, "expected password");
        assert.strictEqual(typeof json.password, "string", "correct type");

        assert.ok(json.hasOwnProperty("_createdOn"), "_createdOn exist");
        assert.strictEqual(typeof json._createdOn, "number", "correct type");

        assert.ok(json.hasOwnProperty("_id"), "_id exist");
        assert.strictEqual(typeof json._id, "string", "correct type");

        assert.ok(json.hasOwnProperty("accessToken"), "accessToken exist");
        assert.strictEqual(typeof json.accessToken, "string", "correct type");

        token = json.accessToken;
        userId = json._id;
        sessionStorage.setItem("pet-user", JSON.stringify(user));
    });

    QUnit.test("login", async (assert) => {
        let path = 'users/login';

        let response = await fetch(baseUrl + path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        assert.ok(response.ok, "successful response");

        let json = await response.json();
        console.log(json);

        assert.ok(json.hasOwnProperty("email"), "email exist");
        assert.strictEqual(json.email, user.email, "expected email");
        assert.strictEqual(typeof json.email, "string", "correct type");

        assert.ok(json.hasOwnProperty("password"), "password exist");
        assert.strictEqual(json.password, user.password, "expected password");
        assert.strictEqual(typeof json.password, "string", "correct type");

        assert.ok(json.hasOwnProperty("_createdOn"), "_createdOn exist");
        assert.strictEqual(typeof json._createdOn, "number", "correct type");

        assert.ok(json.hasOwnProperty("_id"), "_id exist");
        assert.strictEqual(typeof json._id, "string", "correct type");

        assert.ok(json.hasOwnProperty("accessToken"), "accessToken exist");
        assert.strictEqual(typeof json.accessToken, "string", "correct type");

        token = json.accessToken;
        userId = json._id;
    });
});

QUnit.module("pet functionalities", () => {
    QUnit.test("get all postcards", async (assert) => {
        let path = 'data/pets';
        let queryParam = '?sortBy=_createdOn%20desc&distinct=name';

        let response = await fetch(baseUrl + path + queryParam);

        assert.ok(response.ok, 'successful response');

        let json = await response.json();
        console.log(json);

        assert.ok(Array.isArray(json), 'response is array');

        json.forEach(jsonData => {
            assert.ok(jsonData.hasOwnProperty('age'), "age exist");
            assert.strictEqual(typeof jsonData.age, 'string', "age is a string");

            assert.ok(jsonData.hasOwnProperty('breed'), "breed exist");
            assert.strictEqual(typeof jsonData.breed, 'string', "breed is a string");

            assert.ok(jsonData.hasOwnProperty('image'), "image exist");
            assert.strictEqual(typeof jsonData.image, 'string', "image is a string");

            assert.ok(jsonData.hasOwnProperty('name'), "name exist");
            assert.strictEqual(typeof jsonData.name, 'string', "name is a string");

            assert.ok(jsonData.hasOwnProperty('weight'), "weight exist");
            assert.strictEqual(typeof jsonData.weight, 'string', "weight is a string");

            assert.ok(jsonData.hasOwnProperty('_createdOn'), "_createdOn exist");
            assert.strictEqual(typeof jsonData._createdOn, 'number', "_createdOn is a number");

            assert.ok(jsonData.hasOwnProperty('_id'), "_id exist");
            assert.strictEqual(typeof jsonData._id, 'string', "_id is a string");

            assert.ok(jsonData.hasOwnProperty('_ownerId'), "_ownerId exist");
            assert.strictEqual(typeof jsonData._ownerId, 'string', "_ownerId is a string");
        });
    });

    QUnit.test("create postcard", async (assert) => {
        let path = 'data/pets';

        let random = Math.floor(Math.random() * 10000);

        pet.name = `random pet name ${random}`;
        pet.breed = `random pet breed ${random}`;

        let response = await fetch(baseUrl + path, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'X-Authorization': token
            },
            body: JSON.stringify(pet)
        });

        assert.ok(response.ok, 'successful response');

        let json = await response.json();
        console.log(json);

        assert.ok(json.hasOwnProperty('age'), "age exist");
        assert.strictEqual(json.age, pet.age, "expected age");
        assert.strictEqual(typeof json.age, 'string', "age is a string");

        assert.ok(json.hasOwnProperty('breed'), "breed exist");
        assert.strictEqual(json.breed, pet.breed, "expected breed");
        assert.strictEqual(typeof json.breed, 'string', "breed is a string");

        assert.ok(json.hasOwnProperty('image'), "image exist");
        assert.strictEqual(json.image, pet.image, "expected image");
        assert.strictEqual(typeof json.image, 'string', "image is a string");

        assert.ok(json.hasOwnProperty('name'), "name exist");
        assert.strictEqual(json.name, pet.name, "expected name");
        assert.strictEqual(typeof json.name, 'string', "name is a string");

        assert.ok(json.hasOwnProperty('weight'), "weight exist");
        assert.strictEqual(json.weight, pet.weight, "expected weight");
        assert.strictEqual(typeof json.weight, 'string', "weight is a string");

        assert.ok(json.hasOwnProperty('_createdOn'), "_createdOn exist");
        assert.strictEqual(typeof json._createdOn, 'number', "_createdOn is a number");

        assert.ok(json.hasOwnProperty('_id'), "_id exist");
        assert.strictEqual(typeof json._id, 'string', "_id is a string");

        assert.ok(json.hasOwnProperty('_ownerId'), "_ownerId exist");
        assert.strictEqual(typeof json._ownerId, 'string', "_ownerId is a string");

        lastCreatedPetId = json._id;
    });

    QUnit.test("edit postcard", async (assert) => {
        let path = 'data/pets/';
        let petId = lastCreatedPetId;

        let random = Math.floor(Math.random() * 10000);
        pet.name = `edited random pet name ${random}`;

        let response = await fetch(baseUrl + path + petId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(pet)
        });

        assert.ok(response.ok, 'successful response');

        let json = await response.json();
        console.log(json);

        assert.ok(json.hasOwnProperty('age'), "age exist");
        assert.strictEqual(json.age, pet.age, "expected age");
        assert.strictEqual(typeof json.age, 'string', "age is a string");

        assert.ok(json.hasOwnProperty('breed'), "breed exist");
        assert.strictEqual(json.breed, pet.breed, "expected breed");
        assert.strictEqual(typeof json.breed, 'string', "breed is a string");

        assert.ok(json.hasOwnProperty('image'), "image exist");
        assert.strictEqual(json.image, pet.image, "expected image");
        assert.strictEqual(typeof json.image, 'string', "image is a string");

        assert.ok(json.hasOwnProperty('name'), "name exist");
        assert.strictEqual(json.name, pet.name, "expected name");
        assert.strictEqual(typeof json.name, 'string', "name is a string");

        assert.ok(json.hasOwnProperty('weight'), "weight exist");
        assert.strictEqual(json.weight, pet.weight, "expected weight");
        assert.strictEqual(typeof json.weight, 'string', "weight is a string");

        assert.ok(json.hasOwnProperty('_createdOn'), "_createdOn exist");
        assert.strictEqual(typeof json._createdOn, 'number', "_createdOn is a number");

        assert.ok(json.hasOwnProperty('_updatedOn'), "_updatedOn exist");
        assert.strictEqual(typeof json._updatedOn, 'number', "_updatedOn is a number");

        assert.ok(json.hasOwnProperty('_id'), "_id exist");
        assert.strictEqual(typeof json._id, 'string', "_id is a string");

        assert.ok(json.hasOwnProperty('_ownerId'), "_ownerId exist");
        assert.strictEqual(typeof json._ownerId, 'string', "_ownerId is a string");

        lastCreatedPetId = json._id;
    });

    QUnit.test("delete postcard", async (assert) => {
        let path = 'data/pets/';

        let response = await fetch(baseUrl + path + lastCreatedPetId, {
            method: "DELETE",
            headers: {
                'X-Authorization': token
            }
        });

        assert.ok(response.ok, 'successful response');        
    });
});
