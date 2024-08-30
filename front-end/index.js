google.charts.load("current", {
    packages: ["corechart", "bar"],
});
google.charts.setOnLoadCallback(loadTable);

// let currentPage = 1;
// const limit = 10;

function loadTable() {    //ใช้บ่อยๆ เพื่ออัเดตหน้าเว็บ ให้เป็นตารางข้อมูลเป็นปัจจุบัน
    const xhttp = new XMLHttpRequest();
    const uri = "http://localhost:3000/smartphone";
    xhttp.open("GET", uri);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var trHTML = "";
            var num = 1;
            const objects = JSON.parse(this.responseText);
            console.log(objects);
    
            for (let object of objects) {
            //object["ชื่อ key จากข้อมูลใดๆก็ได้"]
                trHTML += "<tr>";
                trHTML += "<td>" + num + "</td>";
                trHTML += "<td>" + object["brand"] + "</td>";
                trHTML += "<td>" + object["model"] + "</td>";
                
                if (object["os"]=="ios") {
                    trHTML += "<td>" + "iOS" + "</td>";
                } else {
                    trHTML += "<td>" + object["os"] + "</td>";
                }
                
                const thb = ((object["price"])*0.41)
                trHTML += "<td>" + thb.toFixed(0) + "</td>";
                
                trHTML += "<td>" + object["support5G"] + "</td>";
                trHTML += "<td>" + object["processorBrand"] + "</td>";
                trHTML += "<td>" + object["processorSpeed"] + "</td>";
                trHTML += "<td>" + object["ramCapacity"] + "</td>";
                trHTML += "<td>" + object["internalMemory"] + "</td>";
                trHTML += "<td>" + object["screenSize"] + "</td>";
                trHTML += "<td>";
                // ปุ่มสำหรับการกด กดแล้วมีหน้าเมนูในการจัดการข้อมูล 1 ชุดข้อมูล(1 คน)
                trHTML +='<a type="button" class="btn btn-outline-secondary me-2" onclick="showStudentUpdateBox(\'' +object["_id"] +'\')"><i class="fas fa-edit"></i></a>';
                trHTML +='<a type="button" class="btn btn-outline-danger" onclick="showStudentDeleteBox(\'' +object["_id"] + '\')"><i class="fas fa-trash"></i></a>';
                // ปุ่มฟังก์ชั่นการอัปเดต และลบ (รอการทำงานหลังกดปุ่ม)
                trHTML += "<tr>";
        
                num++;
            }
            document.getElementById("mytable").innerHTML = trHTML;
        loadGraph(objects); // โหลดกราฟ ใช้ร่วมกับ google
        }
    };
}
loadTable();

function loadGraph(objects) {
    // Brand
    var APCount = 0;
    var SamCount = 0;
    var GGCount = 0;
    var HonorCount = 0;
    var huaweiCount = 0;
    var vivoCount = 0;
    var oppoCount = 0;
    var xiaomiCount = 0;

    // 5G
    var YesCount = 0;
    var NoCount = 0;



    for (let object of objects) {
        // brand
        switch (object["brand"]) {
            case "apple":
                APCount = APCount + 1;
            break;

            case "samsung":
                SamCount = SamCount + 1;
            break;

            case "google":
                GGCount = GGCount + 1;
            break;

            case "honor":
                HonorCount = HonorCount + 1;
            break;

            case "huawei":
                huaweiCount = huaweiCount + 1;
            break;

            case "vivo":
                vivoCount = vivoCount + 1;
            break;

            case "oppo":
                oppoCount = oppoCount + 1;
            break;

            case "xiaomi":
                xiaomiCount = xiaomiCount + 1;
            break;
        }
        // 5G
        switch (object["support5G"]) {
            case "Yes":
                YesCount = YesCount + 1;
            break;
            case "No":
                NoCount = NoCount + 1;
            break;
        }

    }

    var TimelyResponseData = google.visualization.arrayToDataTable([
        ["support5G", "Field"],
        ["5G Support", YesCount],
        ["5G Not Support", NoCount],
    ]);

    var optionsTimelyResponse = { 
        Title: "5G Supported smartphone models",
        legentFontSize: 15,
        fontSize: 15,
        titleFontSize: 15,
        colors: ['#3c6799', '#eeaeca'],
        tooltipFontSize: 15 };


    var chartTimelyResponse = new google.visualization.PieChart(
        document.getElementById("piechartTimelyResponse")
    );
    chartTimelyResponse.draw(TimelyResponseData, optionsTimelyResponse);

    //
    var dataSubmitted = google.visualization.arrayToDataTable([
        [
            "Brand Titile",
            "Number",
            {
                role: "style",
            },
            {
                role: "annotation",
            },
        ],
        ["Xiaomi", xiaomiCount, "color: #EC7A08", "Xiaomi"],
        ["Samsung", SamCount, "color: #004B95", "Samsung"],
        ["Vivo", vivoCount, "color: #519DE9", "Vivo"],
        ["Oppo", oppoCount, "color: #607EAA", "Oppo"],
        ["Apple", APCount, "color: #8A8D90", "Apple"],
        ["Huawei", huaweiCount, "color: #A30000", "Huawei"],
        ["Google", GGCount, "color: #8481DD", "Google"],
        ["Honor", HonorCount, "color: #009596", "Honor"],
    ]);

    var optionSubmitted = {
        title: "Number of Smartphone Models of popular Brands",
        legend: { position: "none" },
        legentFontSize: 15,
        fontSize: 15,
        titleFontSize: 15,
        tooltipFontSize: 15
    };

    var chartSubmitted = new google.visualization.BarChart(
        document.getElementById("barchartSubmitted")
    );
    chartSubmitted.draw(dataSubmitted, optionSubmitted);

    
}


function showStudentCreateBox() {
    var d = new Date();
    var h = d.getHours().toString()
    var m = d.getMinutes().toString()
    var tz = d.toString().match(/([A-Z]+[\+-][0-9]+.*)/)[1]
    const time = h + ":" + m + " " + tz
    const date = (d.toISOString().split("T")[0])+ " | " + time;

    Swal.fire({
        title: "To add a new model smartphone, Please inform...",
        html:
            '<div class="mb-3"><label for="CreatedDate" class="form-label"></label>' +
            '<input id="CreatedDate" class="swal2-input" placeholder="Created Date and Time()" type="hidden" value="' + date +'">' +
    
            '<div class="mb-3"><label for="brand" class="form-label">Smartphone Brand</label>' +
            '<input class="form-control" id="brand" placeholder="eg. Apple, Samsung"></div>' +
    
            '<div class="mb-3"><label for="model" class="form-label">Smartphone Model</label>' +
            '<input class="form-control" id="model" placeholder="eg. Apple iPhone 16 Pro Max"></div>' +
    
            '<div class="mb-3"><label for="os" class="form-label">OS (Operating System)</label>' +
            '<input class="form-control" id="os" placeholder="eg. iOS, Android"></div>' +
    
            '<div class="mb-3"><label for="price" class="form-label">Price (THB.)</label>' +
            '<input class="form-control" id="price" placeholder="Price in THB.(Thai)"></div>' +
    //
            '<div class="mb-3"><label for="support5G" class="form-label">5G Support</label> <br>' +
            '<select class="form-select" id="support5G" aria-label="Default select example">'+
                '<option selected></option>'+
                '<option value="Yes">Yes</option>'+
                '<option value="No">No</option>'+
            '</select><br>'+

            // '<input class="form-control" id="5G_or_not" placeholder="<Yes> or <No>"></div>' +
    //
    
            '<div class="mb-3"><label for="processorBrand" class="form-label">Processor Brand</label>' +
            '<input class="form-control" id="processorBrand" placeholder="eg. bionic, snapdragon"></div>' +
            
            '<div class="mb-3"><label for="processorSpeed" class="form-label">Processor Speed</label>' +
            '<input class="form-control" id="processorSpeed" placeholder="eg. 3.14 (Numbers up tp 2 decimal places)"></div>' +
    
            '<div class="mb-3"><label for="ramCapacity" class="form-label">RAM(GB)</label>' +
            '<input class="form-control" id="ramCapacity" placeholder="Answer with Integers NUMBER eg. 8, 16"></div>' +
    
            '<div class="mb-3"><label for="internalMemory" class="form-label">ROM(GB)</label>' +
            '<input class="form-control" id="internalMemory" placeholder="Answer with Integers NUMBER eg. 64, 128"></div>' +
    
            '<div class="mb-3"><label for="screenSize" class="form-label">Screen size(inches)</label>' +
            '<input class="form-control" id="screenSize" placeholder="eg. 6.8 (Numbers up tp 1 decimal places)"></div>',
    
        focusConfirm: false,
        preConfirm: () => {
            slistCreate();
        },
    });
}



function slistCreate() {
    const CreatedDate = document.getElementById("CreatedDate").value;
    const brand = document.getElementById("brand").value;
    const model = document.getElementById("model").value;
    const os = document.getElementById("os").value;
    const price = document.getElementById("price").value / 0.41;
    const support5G = document.getElementById("support5G").value;
    // if (support5G=="Open this select Yes or No") {
    //     support5G = "Not yet filled" ;
    // }

    const processorBrand = document.getElementById("processorBrand").value;
    const processorSpeed = document.getElementById("processorSpeed").value;
    const ramCapacity = document.getElementById("ramCapacity").value;
    const internalMemory = document.getElementById("internalMemory").value;
    const screenSize = document.getElementById("screenSize").value;

    console.log(
        JSON.stringify({
            CreatedDate: CreatedDate,
            brand: brand,
            model: model,
            os: os,
            price: price,
            support5G: support5G,
            processorBrand: processorBrand,
            processorSpeed: processorSpeed,
            ramCapacity: ramCapacity,
            internalMemory: internalMemory,
            screenSize: screenSize,
        })
    );

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3000/smartphone/create");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
        JSON.stringify({
            CreatedDate: CreatedDate,
            brand: brand,
            model: model,
            os: os,
            price: price,
            support5G: support5G,
            processorBrand: processorBrand,
            processorSpeed: processorSpeed,
            ramCapacity: ramCapacity,
            internalMemory: internalMemory,
            screenSize: screenSize,
        })
    );

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            Swal.fire(
                "Good job!",
                "Create Smartphone Model Successfully!",
                "success"
                );
            loadTable();
        }
    };
}

function showStudentUpdateBox(id) {
    console.log("edit", id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/smartphone/" + id);
    xhttp.send();

    // const priceUpTh = object["price"] * 0.41 ;
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const object = JSON.parse(this.responseText).Complaint;
            console.log("showStudentUpdateBox", object);
            Swal.fire({
                title: "Update Smartphone Model Information",
                html:
                    '<input id="id" class="swal2-input" placeholder="OID" type="hidden" value="' +object["_id"] +'"><br>' +
                    '<div class="mb-3"><label for="CreatedDate" class="form-label">Created Date</label>' +
                    '<input class="form-control" id="CreatedDate" placeholder="Created_Date" value="' +object["CreatedDate"] +'"></div>' +

                    '<div class="mb-3"><label for="brand" class="form-label">Smartphone Brand</label>' +
                    '<input class="form-control" id="brand" placeholder="eq. Apple, Samsung" value="' +object["brand"] +'"></div>' +
        
                    '<div class="mb-3"><label for="model" class="form-label">Model</label>' +
                    '<input class="form-control" id="model" placeholder="eg. Apple iPhone 16 Pro Max" value="' +object["model"] +'"></div>' +
        
                    '<div class="mb-3"><label for="os" class="form-label">OS</label>' +
                    '<input class="form-control" id="os" placeholder="eg. iOS, Android" value="' +object["os"] +'"></div>' +
        
                    '<div class="mb-3"><label for="price" class="form-label">Price (THB.)</label>' +
                    '<input class="form-control" id="price" placeholder="Price in THB.(Thai)" value="' + (object["price"] * 0.41).toFixed(0) +'"></div>' +
        
                    '<div class="mb-3"><label for="support5G" class="form-label">5G Support</label>' +
                    '<input class="form-control" id="support5G" placeholder="<Yes> or <No>" value="' + object["support5G"] +'"></div>' +

                    
                    // '<input class="form-control" id="support5G" placeholder="support5G" value="' +object["support5G"] +'"></div>' +
                    // '<input type="radio" id="support5G" name="support5G" value="Yes">' +
                    // '<label for="support5G">Yes</label><br>' +

                    // '<input type="radio" id="support5G" name="support5G" value="No">' +
                    // '<label for="support5G">No</label><br></br>' +

        
                    '<div class="mb-3"><label for="processorBrand" class="form-label">Processor Brand</label>' +
                    '<input class="form-control" id="processorBrand" placeholder="processorBrand" value="' +object["processorBrand"] +'"></div>' +
        
                    '<div class="mb-3"><label for="processorSpeed" class="form-label">Processor Speed</label>' +
                    '<input class="form-control" id="processorSpeed" placeholder="processorSpeed" value="' +object["processorSpeed"] +'"></div>' +
        
                    '<div class="mb-3"><label for="ramCapacity" class="form-label">RAM(GB)</label>' +
                    '<input class="form-control" id="ramCapacity" placeholder="ramCapacity" value="' +object["ramCapacity"] +'"></div>' +
        
                    '<div class="mb-3"><label for="internalMemory" class="form-label">ROM(GB)</label>' +
                    '<input class="form-control" id="internalMemory" placeholder="internalMemory" value="' +object["internalMemory"] +'"></div>' +
                    
                    '<div class="mb-3"><label for="screenSize" class="form-label">Screen Size(inches)</label>' +
                    '<input class="form-control" id="screenSize" placeholder="screenSize" value="' +object["screenSize"] +'"></div>',
        
                focusConfirm: false,
                preConfirm: () => {
                    studentUpdate();
                },
            });
        }
    };
}

function studentUpdate() {
    const id = document.getElementById("id").value;
    const CreatedDate = document.getElementById("CreatedDate").value;
    const brand = document.getElementById("brand").value;
    const model = document.getElementById("model").value;
    const os = document.getElementById("os").value;
    const price = document.getElementById("price").value / 0.41 ;

    // const price = document.getElementById("price").value;

    const support5G = document.getElementById("support5G").value;
    const processorBrand = document.getElementById("processorBrand").value;
    const processorSpeed = document.getElementById("processorSpeed").value;
    const ramCapacity = document.getElementById("ramCapacity").value;
    const internalMemory = document.getElementById("internalMemory").value;
    const screenSize = document.getElementById("screenSize").value;

    console.log(
        JSON.stringify({
            _id: id,
            CreatedDate: CreatedDate,
            brand: brand,
            model: model,
            os: os,
            price: price,
            support5G: support5G,
            processorBrand: processorBrand,
            processorSpeed: processorSpeed,
            ramCapacity: ramCapacity,
            internalMemory: internalMemory,
            screenSize: screenSize,
        })
    );

    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "http://localhost:3000/smartphone/update");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
        JSON.stringify({
            _id: id,
            CreatedDate: CreatedDate,
            brand: brand,
            model: model,
            os: os,
            price: price,
            support5G: support5G,
            processorBrand: processorBrand,
            processorSpeed: processorSpeed,
            ramCapacity: ramCapacity,
            internalMemory: internalMemory,
            screenSize: screenSize,
        })
    );

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            Swal.fire(
                "Good job!",
                "Update Smartphone Model Information Successfully!",
                "success"
            );
            loadTable();
        }
    };
}

function showStudentDeleteBox(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            studentDelete(id);
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        }
    })
}

function studentDelete(id) {
    console.log("Delete: ", id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "http://localhost:3000/smartphone/delete");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
        JSON.stringify({
            _id: id,
        })
    );
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            const objects = JSON.parse(this.responseText);
            Swal.fire(
                "Good job!",
                "ข้อมูลได้คามุยหายไปแล้วเรียบร้อย",
                "success"
            );
            loadTable();
        }
    };
}

function loadQueryTable() {
    document.getElementById("mytable").innerHTML ='<tr><th scope="row" colspan="11">Loading...</th></tr>';
    const searchText = document.getElementById("searchTextBox").value;

    if (searchText=="") {
        loadTable();
    } else {
        const xhttp = new XMLHttpRequest();
        const uri = "http://localhost:3000/smartphone/field/" + searchText;
        xhttp.open("GET", uri);
    
        xhttp.send();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var trHTML = "";
                var num = 1;
                const objects = JSON.parse(this.responseText).Complaint;
                
                if (objects.length > 0) {
                    for (let object of objects) {
                        trHTML += "<tr>";
                        trHTML += "<td>" + num + "</td>";
                        trHTML += "<td>" + object["brand"] + "</td>";
                        trHTML += "<td>" + object["model"] + "</td>";
                        
                        if (object["os"]=="ios") {
                            trHTML += "<td>" + "iOS" + "</td>";
                        } else {
                            trHTML += "<td>" + object["os"] + "</td>";
                        }
    
                        const thb = ((object["price"]) * 0.41)
                        trHTML += "<td>" + thb.toFixed(0) + "</td>";
                        
                        trHTML += "<td>" + object["Support5G"] + "</td>";
                        trHTML += "<td>" + object["processorBrand"] + "</td>";
                        trHTML += "<td>" + object["processorSpeed"] + "</td>";
                        trHTML += "<td>" + object["ramCapacity"] + "</td>";
                        trHTML += "<td>" + object["internalMemory"] + "</td>";
                        trHTML += "<td>" + object["screenSize"] + "</td>";
                        trHTML += "<td>";
                        trHTML += '<a type="button" class="btn btn-outline-secondary" onclick="showStudentUpdateBox(\'' + object["_id"] + '\')"><i class="fas fa-edit"></i></a>';
                        trHTML += '<a type="button" class="btn btn-outline-danger" onclick="studentDelete(\'' + object["_id"] + '\')"><i class="fas fa-trash"></i></a></td>';
                        trHTML += "</tr>";
                        num++;
                    }
                } else {
                    // ไถ้าหาข้อมูลไม่เจอ จะแสดงข้อความ "หาไม่เจอ"
                    trHTML = '<tr><th scope="row" colspan="11" class="center-text">Sorry... No results found for your search.</th></tr>';
                }
    
                console.log(trHTML);
                document.getElementById("mytable").innerHTML = trHTML;
            }
        };
    }

}



// function loadQueryTable() {
//     document.getElementById("mytable").innerHTML ='<tr><th scope="row" colspan="11">Loading...</th></tr>';
//     const searchText = document.getElementById("searchTextBox").value;

//     const xhttp = new XMLHttpRequest();
//     const uri = "http://localhost:3000/smartphone/field/" + searchText;
//     xhttp.open("GET", uri);

//     xhttp.send();
//     xhttp.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             var trHTML = "";
//             var num = 1;
//             const objects = JSON.parse(this.responseText).Complaint;
//             for (let object of objects) {
//                 trHTML += "<tr>";
//                 trHTML += "<td>" + num + "</td>";
//                 trHTML += "<td>" + object["brand"] + "</td>";
//                 trHTML += "<td>" + object["model"] + "</td>";
//                 trHTML += "<td>" + object["os"] + "</td>";
                
//                 const thb = ((object["price"])*0.41)
//                 trHTML += "<td>" + thb.toFixed(0) + "</td>";
                
                
//                 // ต้องเปลี่ยน 0/1 เป็น Yes/No (5G)
//                 if (object["support5G"] == 1) {
//                     trHTML += "<td>" + "Yes" + "</td>";
//                 } else {
//                     trHTML += "<td>" + "No" + "</td>";
//                 }

//                 trHTML += "<td>" + object["processorBrand"] + "</td>";
//                 trHTML += "<td>" + object["processorSpeed"] + "</td>";
//                 trHTML += "<td>" + object["ramCapacity"] + "</td>";
//                 trHTML += "<td>" + object["internalMemory"] + "</td>";
//                 trHTML += "<td>" + object["screenSize"] + "</td>";
//                 trHTML += "<td>";
//                 trHTML +=
//                     '<a type="button" class="btn btn-outline-secondary" onclick="showStudentUpdateBox(\'' +
//                     object["_id"] +
//                     '\')"><i class="fas fa-edit"></i></a>';
//                 trHTML +=
//                     '<a type="button" class="btn btn-outline-danger" onclick="studentDelete(\'' +
//                     object["_id"] +
//                     '\')"><i class="fas fa-trash"></i></a></td>';
//                 trHTML += "<tr>";
//                 num++;
//             }
//             console.log(trHTML);
//             document.getElementById("mytable").innerHTML = trHTML;

//             // loadGraph(objects);
//         } else {
//             // ถ้าค้นหาแล้วไม่พบข้อมูล
//             trHTML = '<tr><th scope="row" colspan="11" class="center-text">Sorry... No results found for your search.</th></tr>';
//             console.log(trHTML);
//             document.getElementById("mytable").innerHTML = trHTML;
//         }
//     };
// }


// function searchSmartphoneModel() {
//     const model = document.getElementById("searchModel").value; // Assuming you have an input field with this ID

//     const xhttp = new XMLHttpRequest();
//     const uri = `http://localhost:3000/smartphone/search?model=${model}`;
//     xhttp.open("GET", uri);
//     xhttp.send();

//     xhttp.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             var trHTML = "";
//             var num = 1;
//             const objects = JSON.parse(this.responseText);
//             console.log(objects);

//             for (let object of objects) {
//                 trHTML += "<tr>";
//                 trHTML += "<td>" + num + "</td>";
//                 trHTML += "<td>" + object["brand"] + "</td>";
//                 trHTML += "<td>" + object["model"] + "</td>";
//                 trHTML += "<td>" + object["os"] + "</td>";

//                 const thb = ((object["price"]) * 0.41);
//                 trHTML += "<td>" + thb.toFixed(0) + "</td>";

//                 if (object["support5G"] == 1) {
//                     trHTML += "<td>Yes</td>";
//                 } else {
//                     trHTML += "<td>No</td>";
//                 }

//                 trHTML += "<td>" + object["processorBrand"] + "</td>";
//                 trHTML += "<td>" + object["processorSpeed"] + "</td>";
//                 trHTML += "<td>" + object["ramCapacity"] + "</td>";
//                 trHTML += "<td>" + object["internalMemory"] + "</td>";
//                 trHTML += "<td>" + object["screenSize"] + "</td>";
//                 trHTML += "<td>";
//                 trHTML += '<a type="button" class="btn btn-outline-secondary me-2" onclick="showStudentUpdateBox(\'' + object["_id"] + '\')"><i class="fas fa-edit"></i></a>';
//                 trHTML += '<a type="button" class="btn btn-outline-danger" onclick="showStudentDeleteBox(\'' + object["_id"] + '\')"><i class="fas fa-trash"></i></a>';
//                 trHTML += "<tr>";

//                 num++;
//             }
//             document.getElementById("mytable").innerHTML = trHTML;
//         }
//     };
// }