/** Use this command to get the tables in WebSQL dev console
 * SELECT tbl_name, sql from sqlite_master WHERE type = 'table'
 */
// function to save form for demographics
function saveDemographics() {
    console.log("Save Demographics Call");

    event.preventDefault();
    var fname = document.getElementById("fname").value;
    var lname = document.getElementById("lname").value;
    var gender = document.getElementById("gender").value;
    var age = document.getElementById("age").value;
    var notes = document.getElementById("other").value;
    var photo = document.getElementById("photo") ? 
                document.getElementById("photo").value.substring(12) : null;
    // var photo = photo.substring(12);
    // console.log(photo.substring(12));
    // set all the variables
    var db = openDatabase('healthSpa', '1.0', 'HealthSpa DB', 2 * 1024 * 1024); 

    var name = fname + " " + lname;
    db.transaction(function (tx) {   
        tx.executeSql('CREATE TABLE IF NOT EXISTS Patients \
        (pid INTEGER PRIMARY KEY, name, age, gender, medications, notes, photo)');
        tx.executeSql('INSERT INTO Patients (name, gender, age, photo) VALUES(?, ?, ?, ?)', 
                        [name, gender, age, photo]);
        // get the most recent added ID
        console.log("HELLO ABOUT TO SELECT");
        tx.executeSql('SELECT pid FROM Patients WHERE name = '+quoteString(name)+' \
        AND gender = '+quoteString(gender)+' AND age = '+quoteString(age),
        [],
        function(tx, results) {
            console.log(results.rows[0].pid);
            
            sessionStorage.setItem('curId', results.rows[0].pid);
        });
    });
    
    var demos = document.getElementById("demographics");
    var vitals = document.getElementById("vitals");
    demos.style.display = "none";
    vitals.style.display = "block";

    //window.location.assign("vitals.html");
}
// function to save form for health vitals
function saveVitals() {
    console.log("Save Health Vitals Call");

    event.preventDefault();
    var height = document.getElementById("height").value;
    var weight = document.getElementById("weight").value;
    var bTemp = document.getElementById("bTemp").value;
    var pulse = document.getElementById("pulse").value;
    var bp = document.getElementById("bp").value;
    var meds = document.getElementById("medications").value;
    var notes = document.getElementById("notes").value;

    var db = openDatabase('healthSpa', '1.0', 'HealthSpa DB', 2 * 1024 * 1024);

    db.transaction(function (tx) {   
        tx.executeSql('CREATE TABLE IF NOT EXISTS Patients \
        (id INTEGER PRIMARY KEY, name, age, gender, medications, notes, photo)');
        console.log(quoteString(meds), quoteString(notes), parseInt(sessionStorage.getItem('curId')));
        console.log("query:", 'UPDATE Patients SET medications='+quoteString(meds)+', notes='+quoteString(notes)+' WHERE pid = '+parseInt(sessionStorage.getItem('curId')));
        tx.executeSql('UPDATE Patients SET medications='+quoteString(meds)+', notes='+quoteString(notes)+' WHERE pid = '+parseInt(sessionStorage.getItem('curId')));
                        //, [meds, notes, parseInt(sessionStorage.getItem('curId')) ]);
        // get the most recent added ID
        
    });

    var report = document.getElementById("report");
    var vitals = document.getElementById("vitals");
    report.style.display = "block";
    vitals.style.display = "none";
    showReport();
    //window.location.assign("");
}
// function to read from DB
function showReport() {

    var db = openDatabase('healthSpa', '1.0', 'HealthSpa DB', 2 * 1024 * 1024);

    db.transaction(function (tx) { 
        tx.executeSql('SELECT * FROM Patients', [], function (tx, results) { 
           var len = results.rows.length, i; 
           //msg = "<p>Found rows: " + len + "</p>"; 
           //document.querySelector('#status').innerHTML +=  msg; 
            var report = document.getElementById("report");
            
           for (i = 0; i < len; i++) { 
              //msg = "<p><b>" + results.rows.item(i).log + "</b></p>"; 
              //document.querySelector('#status').innerHTML +=  msg;
               var patientRow = document.createElement("tr");

               var patientDetail = document.createElement("td");
               var detail = document.createTextNode(results.rows[i].name);
               patientDetail.appendChild(detail);
               patientRow.appendChild(patientDetail);

               var patientDetail = document.createElement("td");
               var detail = document.createTextNode(results.rows[i].age);
               patientDetail.appendChild(detail);
               patientRow.appendChild(patientDetail);

               var patientDetail = document.createElement("td");
               var detail = document.createTextNode(results.rows[i].gender);
               patientDetail.appendChild(detail);
               patientRow.appendChild(patientDetail);

               var patientDetail = document.createElement("td");
               var detail = document.createTextNode(results.rows[i].photo);
               patientDetail.appendChild(detail);
               patientRow.appendChild(patientDetail);

               var patientDetail = document.createElement("td");
               var detail = document.createTextNode(results.rows[i].medications);
               patientDetail.appendChild(detail);
               patientRow.appendChild(patientDetail);

               var patientDetail = document.createElement("td");
               var detail = document.createTextNode(results.rows[i].notes);
               patientDetail.appendChild(detail);
               patientRow.appendChild(patientDetail);

               report.appendChild(patientRow);
           } 
        }, null); 
     }); 
}
// function to access camera and take picture???

function quoteString(string) {
    return '"' + string + '"';
}