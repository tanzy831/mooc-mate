<?php

    include "common.php";

    $data = 'username=user1';

    $ch = curl_init ();
    curl_setopt ( $ch, CURLOPT_URL, $uri."/api/mine" );
    curl_setopt ( $ch, CURLOPT_POST, 1 );
    curl_setopt ( $ch, CURLOPT_HEADER, 0 );
    curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
    curl_setopt ( $ch, CURLOPT_POSTFIELDS, $data );
    $return = curl_exec ( $ch );
    curl_close ( $ch );

    $obj = json_decode($return);

    $ret = $obj->data;

    // exit();

?>

<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- 上述3个meta标签*必须*放在最前面，任何其他内容都*必须*跟随其后！ -->
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="../../favicon.ico">

    <title>MoocMate Center</title>

    <!-- Bootstrap core CSS -->
    <link href="./css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="./css/dashboard.css" rel="stylesheet">

    <!-- Just for debugging purposes. Don't actually copy these 2 lines! -->
    <!--[if lt IE 9]><script src="../../assets/js/ie8-responsive-file-warning.js"></script><![endif]-->
    <script src="./js/ie-emulation-modes-warning.js"></script>
    <script src="js/jquery.js" type="text/javascript"></script>
    <script src="js/qrcode.js" type="text/javascript"></script>

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="//cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="//cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>

  <body>

    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <!-- <a class="navbar-brand" href="#">Mooc Mate</a> -->
          <div class="navbar-name" href="#">Mooc Mate</div>
          <!-- <a class="navbar-icon" href="#"><img src="./img/topbar_icon.png"/></a> -->
        </div>

      </div>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-3 col-md-2 sidebar">

          <ul class="nav nav-briefinfo">
            <li><a href=""><img class="icon" src="./img/head_icon.png" alt="Icon"/></a></li>
            <li><a href="" class="user_name">Eric Wong</a></li>
          </ul>

          <br>

<!--           <ul class="nav nav-sidebar">
            <li class="active"><a href="#">Overview <span class="sr-only">(current)</span></a></li>
          </ul> -->

          <ul class="nav nav-mynotes">
            <li class="list-header">My Notes</li>
            <li class="active"><a href="i_wrote.php">Note I Wrote</a></li>
            <!-- <li class="active"><a href="./i_liked.html">Note I Liked</a></li>
            <li class="active"><a href="./people_liked.html">Note People Liked</a></li> -->
          </ul>

          <br>

          <ul class="nav nav-settings">
            <li class="list-header">Settings</li>
            <li class="active"><a href="./profile.php">Change Profile</a></li>
            <li class="active"><a href="./password.php">Reset Password</a></li>
            <li class="active"><a href="./avatar.php">Change Avatar</a></li>
          </ul>

        </div>
        <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
          <h1 class="page-header">Note I Wrote</h1>



<!--           <h2 class="sub-header">(CourseName)</h2> -->
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Site</th>
                  <th>Course</th>
                  <th>Chapter</th>
                  <th>Title</th>
                  <th>Content</th>
                  <th>Stars</th>
                  <th>View HTML</th>
                  <th>View PDF</th>
                  <th>QRCode</th>
                </tr>
              </thead>
              <tbody>
              <?php for($i = 0; $i < count($ret); $i++ ){ ?>
                <tr>
                  <td><?php echo $ret[$i]->site; ?></td>
                  <td><?php echo $ret[$i]->course; ?></td>
                  <td><?php echo $ret[$i]->chapter; ?></td>
                  <td><?php echo $ret[$i]->title; ?></td>
                  <td><?php echo $ret[$i]->content; ?></td>
                  <td><?php echo $ret[$i]->star; ?></td>
                  <td><a href="<?php echo $uri; ?>/save.html">View</a></td>
                  <td><a href="<?php echo $uri; ?>/save.pdf">Download</a></td>
                  <td><img src="img/qrcode.png" style="width: 50px;"/></td>
                </tr>
            <?php } ?>

            <div id="qrcode"></div>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="./js/jquery.min.js"></script>
    <script src="./js/bootstrap.min.js"></script>
    <!-- Just to make our placeholder images work. Don't actually copy the next line! -->
    <script src="./js/vendor/holder.min.js"></script>
    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <script src="./js/ie10-viewport-bug-workaround.js"></script>
                <script type="text/javascript">

                jquery('#qrcode').qrcode("this plugin is great");
            </script>
  </body>
</html>
