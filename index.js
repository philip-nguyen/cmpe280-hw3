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
        (id INTEGER PRIMARY KEY, name, age, gender, medications, notes, photo)');
        tx.executeSql('INSERT INTO Patients (name, gender, age, photo) VALUES(?, ?, ?, ?)', 
                        [name, gender, age, photo]);
        // get the most recent added ID
        console.log("HELLO ABOUT TO SELECT");
        tx.executeSql('SELECT id FROM Patients WHERE name = '+quoteString(name)+' \
        AND gender = '+quoteString(gender)+' AND age = '+quoteString(age),
        [],
        function(tx, results) {
            console.log(results.rows[0].id);
            
            sessionStorage.setItem('curId', results.rows[0].id);
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
        tx.executeSql('UPDATE Patients SET medications=?, notes=? WHERE id = ?'
                        , 
        [meds, notes, sessionStorage.getItem('curId') ]);
        // get the most recent added ID
        
    });

    //window.location.assign("");
}
// function to read from DB

// function to access camera and take picture???

function quoteString(string) {
    return '"' + string + '"';
}