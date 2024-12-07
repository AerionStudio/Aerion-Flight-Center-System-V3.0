<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>航路查询</title>
    <link rel="stylesheet" href="./css/bootstrap.min.css">
    <link rel="stylesheet" href="./css/animate.min.css">
    <script src="../js/checkall.js"></script>
    <script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "kpp9urix5f");
</script>
    <style>
        body,
        html {
            background-color: transparent !important;
            height: 100%;
            margin: 0;
            padding: 0;
            overflow-y: hidden;
        }
        #animatedCard {
            opacity: 0; /* Initially hide the card */
            animation: fadeInUp 1s forwards; /* Apply the fadeInUp animation */
        }
    </style>
</head>
<body>
<div class="container mt-5">
    <div class="alert alert-primary animate__animated animate__fadeIn" role="alert" id="animatedCard">
  当前服务器航路数据为 2402 ，查询数据慢请点击查询按钮后耐心等待！
</div>
    <div class="card animate__animated animate__fadeIn" id="animatedCard">
        
        <div class="card-header">
            <h5 class="card-title">航路查询</h5>
        </div>
        <div class="card-body">
            <form method="post" action="./view.php">
                <div class="mb-3">
                    <label for="icaoinput" class="form-label">起飞机场 ICAO</label>
                    <input type="text"  name="dep" class="form-control" id="icaoinput" placeholder="例如 ZBAA">
                </div>
                <div class="mb-3">
                    <label for="icaoinput" class="form-label">落地机场 ICAO</label>
                    <input type="text" name="arr" class="form-control" id="icaoinput" placeholder="例如 ZBAA">
                </div>
                <button type="submit" class="btn btn-primary" >查询</button>
            </form>
        </div>
    </div>
</div>
<script src="./js/index.js"></script>
</body>
</html>
