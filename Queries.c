//Queries for Eligibility
Dim Elegibility As Dataset = Scribe.RunDynamicSQLReturn("Select * from [Eligibility] Where [EmpID] = '" & Data("EmpID") & "'")
Dim eTable as DataTable = Elegibility.Tables(0)
Dim eRows as DataRow
Dim elegTable = Data("Elegibility")
Dim elegRows as DataRow

For each eRows In eTable.Rows
    elegRows = elegTable.NewRow()
    elegRows("ID") = System.Guid.NewGuid.ToString()
    elegRows("ParentID") = Scribe.PrimaryID
    elegRows("CareerService") = eRows("ElegibilityCode")
    elegRows("Rating") = eRows("Rating")
    elegRows("ExamDate") = eRows("DateExam")
    elegRows("ExamPlace") = eRows("PlaceExam")
    elegRows("LicenseNo") = eRows("LicenseNo")
    elegRows("LicenseDate") = eRows("LicenseDate")
    elegTable.Rows.Add(elegRows)
Next
Control("Elegibility").DataSource = eTable
Control("Elegibility").DataBind()

//Queries for WorkExperience
Dim Experience as DataSet = Scribe.RunDynamicSQLReturn("Select * from [Experience] Where [EmpID] = '" & Data("EmpID") & "'")
Dim expTable as DataTable = Experience.Table(0)
Dim expRows as DataRow
Dim exTable as DataTable = Data("Experience")
Dim exRows as DataRow

For each expRows In expTable.Rows
    exRows = exTable.NewRow()
    exRows("ID") = System.Guid.NewGuid.ToString()
    exRows("ParentID") = Scribe.PrimaryID
    exRows("From") = expRows("EmploymentStart")
    exRows("To") = expRows("EmploymentEnd")
    exRows("Position") = expRows("Position")
    exRows("Company") = expRows("Agency")
    exRows("Salary") = expRows("AnnualSalary")
    exRows("SalaryIncrement") = expRows("SGStepIncrement")
    exRows("Status") = expRows("EmploymentStatus")
    exRows("GovernmentService") = expRows("GovernmentService")
    exTable.Rows.Add(exRows)
Next
Control("Experience").DataSource = exTable
Control("Experience").DataBind()

//Queries For VoluntaryWork
Dim Voluntary as DataSet = Scribe.RunDynamicSQLReturn("Select * from [VoluntaryWorks] Where [EmpID] = '" & Data("EmpID") & "'")
Dim vTable as DataTable = Voluntary.Tables(0)
Dim vRows as DataRow
Dim volTable As DataTable = Data("VoluntaryWorks")
Dim volRows as DataRow

For each vRows In vTable.Rows
    volRows = volTable.NewRow()
    volRows("ID") = System.Guid.NewGuid.ToString()
    volRows("ParentID") = Scribe.PrimaryID
    volRows("Organization") = vRows("NameOrganization")
    volRows("From") = vRows("DateFrom")
    volRows("To") = vRows("DateTo")
    volRows("Hours") = vRows("NumHours")
    volRows("Position") = vRows("PositionWork")
    volTable.Rows.Add(volRows)
Next
Control("VoluntaryWorks").DataSource = volTable
Control("VoluntaryWorks").DataBind()

//Queries For Training
Dim Training as DataSet = Scribe.RunDynamicSQLReturn("Select * from [Emptraining] Inner JOIN [Training] ON [Emptraining].[TrainingCode] = [Training].[TrainingCode] Where [EmpID] = '" & Data("EmpID") & "'")
Dim tTable as DataTable = Training.Tables(0)
Dim tRows as DataRow
Dim trainTable As DataTable = Data("Training")
Dim trainRows as DataRow

For each tRows In tTable.Rows
trainRows = trainTable.NewRow()
trainRows("ID") = System.Guid.NewGuid.ToString()
trainRows("ParentID") = Scribe.PrimaryID
trainRows("Seminar") = tRows("TrainingTitle")
trainRows("From") = tRows("TrainingStart")
trainRows("To") = tRows("TrainingEnd")
trainRows("Hours") = tRows("TotalHours")
trainRows("ConductedBy") = tRows("TrainingInstitution")
trainTable.Rows.Add(trainRows)
Next
Control("Training").DataSource = trainTable
Control("Training").DataBind()