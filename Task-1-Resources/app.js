window.addEventListener('load', solve);

function solve() {

        let carModelElement = document.getElementById("car-model");
        let carYearElement = document.getElementById("car-year");
        let partNameElement = document.getElementById("part-name");
        let partNumberElement = document.getElementById("part-number");
        let conditionElement = document.getElementById("condition");
        let options = carYearElement.querySelectorAll('option');

        let nextButtonElement = document.getElementById("next-btn");

        let ulInfoElement = document.querySelector(".info-list");
        let ulConfirmElement = document.querySelector(".confirm-list");

        nextButtonElement.addEventListener("click", onNext);

        function onNext(e) {
                e.preventDefault();

                if (carModelElement.value == '' ||
                        carYearElement.value == '' ||
                        partNameElement.value == '' ||
                        partNumberElement.value == '' ||
                        conditionElement.value == '') {
                        return;
                };

                if (Number(carYearElement.value) < 1980 || Number(carYearElement.value) > 2023) {
                        return;
                }

                let liInfoElement = document.createElement("li");
                liInfoElement.setAttribute("class", "part-content");

                let articleInfoElement = document.createElement("article")

                let pInfoCarModelElement = document.createElement("p");
                pInfoCarModelElement.textContent = `Car Model: ${carModelElement.value}`;

                let pInfoCarYearElement = document.createElement("p");
                pInfoCarYearElement.textContent = `Car Year: ${carYearElement.value}`;

                let pInfoPartNameElement = document.createElement("p");
                pInfoPartNameElement.textContent = `Part Name: ${partNameElement.value}`;

                let pInfoPartNumberElement = document.createElement("p");
                pInfoPartNumberElement.textContent = `Part Number: ${partNumberElement.value}`;

                let pInfoConditionElement = document.createElement("p");
                pInfoConditionElement.textContent = `Condition: ${conditionElement.value}`;

                let editButtonInfoElement = document.createElement("button");
                editButtonInfoElement.setAttribute("class", "edit-btn");
                editButtonInfoElement.textContent = "Edit";

                let continueButtonInfoElement = document.createElement("button");
                continueButtonInfoElement.setAttribute("class", "continue-btn");
                continueButtonInfoElement.textContent = "Continue";

                articleInfoElement.appendChild(pInfoCarModelElement);
                articleInfoElement.appendChild(pInfoCarYearElement);
                articleInfoElement.appendChild(pInfoPartNameElement);
                articleInfoElement.appendChild(pInfoPartNumberElement);
                articleInfoElement.appendChild(pInfoConditionElement);

                liInfoElement.appendChild(articleInfoElement);
                liInfoElement.appendChild(editButtonInfoElement);
                liInfoElement.appendChild(continueButtonInfoElement);

                ulInfoElement.appendChild(liInfoElement);

                let editedCarModelElement = carModelElement.value;
                let editedCarYearElement = carYearElement.value;
                let editedPartNameElement = partNameElement.value;
                let editedPartNumberElement = partNumberElement.value;
                let editedConditionElement = conditionElement.value;

                carModelElement.value = '';
                carYearElement.value = '';
                partNameElement.value = '';
                partNumberElement.value = '';
                conditionElement.value = '';


                nextButtonElement.disabled = true;

                editButtonInfoElement.addEventListener("click", onEdit);

                function onEdit() {
                        carModelElement.value = editedCarModelElement;
                        carYearElement.value = editedCarYearElement;
                        partNameElement.value = editedPartNameElement;
                        partNumberElement.value = editedPartNumberElement;
                        conditionElement.value = editedConditionElement;

                        liInfoElement.remove();
                        nextButtonElement.disabled = false;
                }

                continueButtonInfoElement.addEventListener("click", onContinue);

                function onContinue() {
                        let liConfirmElement = liInfoElement;
                        editButtonInfoElement.remove();
                        continueButtonInfoElement.remove();

                        let confirmButton = document.createElement("button");
                        confirmButton.setAttribute("class", "confirm-btn");
                        confirmButton.textContent = "Confirm";

                        let cancelButton = document.createElement("button");
                        confirmButton.setAttribute("class", "cancel-btn");
                        cancelButton.textContent = "Cancel";

                        liConfirmElement.appendChild(confirmButton);
                        liConfirmElement.appendChild(cancelButton);

                        ulConfirmElement.appendChild(liConfirmElement);

                        confirmButton.addEventListener("click", onConfirm);

                        cancelButton.addEventListener("click", onCancel);


                        function onConfirm() {

                                liConfirmElement.remove();
                                nextButtonElement.disabled = false;

                                let imageElement = document.getElementById("complete-img");
                                imageElement.style.visibility = "visible";
                                //imageElement.style.display = 'inline';

                                let completeTextContentElement = document.getElementById("complete-text");
                                completeTextContentElement.textContent = "Part is Ordered!";
                        }

                        function onCancel() {
                                liConfirmElement.remove();
                                nextButtonElement.disabled = false;
                        }
                }
        }
};




