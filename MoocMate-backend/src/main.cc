#include <cinatra/cinatra.hpp>
#include <cinatra/middleware/cookie.hpp>
#include <cinatra/middleware/session.hpp>
#include <cinatra/html_template.hpp>
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>
#include "db/DataBase.hh"
#include "login/LoginControl.hh"
#include "utils/utils.hh"

int main(int argc, char *argv[])
{
    cinatra::Cinatra<LoginControl> app;

    app.route("/api/login", [](cinatra::Request& req, cinatra::Response& res)
    {
        auto body = cinatra::urlencoded_body_parser(req.body());

        if(DataBase::getSingleton().checkLogin(body.get_val("username"), body.get_val("password")))
        {
            res.end(R"({"msg": "success"})");
        }
        else
        {
            res.end(R"({"msg": "failed"})");        
        }
    });

    app.route("/api/video/add", [](cinatra::Request& req, cinatra::Response& res) 
    {
        auto body = cinatra::urlencoded_body_parser(req.body());
        std::string url = body.get_val("url");
        urlDecode(url);
        std::string site = body.get_val("site");
        urlDecode(site);
        std::string course = body.get_val("course");
        urlDecode(course);
        std::string chapter = body.get_val("chapter");
        urlDecode(chapter);
        std::string username = body.get_val("username");
        urlDecode(username);
        std::string title = body.get_val("title");
        urlDecode(title);
        std::string content = body.get_val("content");
        urlDecode(content);
        std::string img = body.get_val("img");
        urlDecode(img);
        std::string cur_time = body.get_val("current_time");
        urlDecode(cur_time);
        size_t time = boost::lexical_cast<size_t>(body.get_val("time"));
        std::cout << "url:" << url << std::endl;
        std::cout << "site:" << site << std::endl;
        std::cout << "course:" << course << std::endl;
        std::cout << "title:" << title << std::endl;
        std::cout << "chapter:" << chapter << std::endl;
        std::cout << "content:" << content << std::endl;
        std::cout << "img:" << img << std::endl;
        std::cout << "cur_time:" << cur_time << std::endl;
        std::cout << "time:" << time << std::endl;
        DataBase::getSingleton().addNote(url, site, course, chapter, username, title, content, img, cur_time, time);
        res.end(R"({"msg": "success"})");
    });

    app.route("/api/video/get", [](cinatra::Request& req, cinatra::Response& res) 
    {
        auto body = cinatra::urlencoded_body_parser(req.body());
        std::string url = body.get_val("url");
        urlDecode(url);
        boost::property_tree::ptree pt, children;

        for(auto&& notes : DataBase::getSingleton().getNotes(url))
        {
            boost::property_tree::ptree notes_pt;
            for(auto&& n : notes.second)
            {
                boost::property_tree::ptree note_pt;
                note_pt.put("id", n.id);
                note_pt.put("username", n.username);
                note_pt.put("title", n.title);
                note_pt.put("content", n.content);
                note_pt.put("star", n.star);
                note_pt.put("current_time", n.current_time);
                note_pt.put("time", n.time);
                notes_pt.push_back(std::make_pair("", note_pt));
            } 
            children.put_child(notes.first, notes_pt);
        }
        pt.put_child("data", children);
        std::stringstream ss;
        write_json(ss, pt);
        res.end(ss.str());
    });

    app.route("/api/video/star", [](cinatra::Request& req, cinatra::Response& res)
    {
        auto body = cinatra::urlencoded_body_parser(req.body());
        int note_id = boost::lexical_cast<int>(body.get_val("id"));
        for(auto& notes : DataBase::getSingleton().urls)
        {
            for(auto& note_list : notes.second.notes)
            {
                for(auto& n : note_list.second)
                {
                    if(note_id == n.id)
                        ++n.star;
                }
            }
        } 
        res.end(R"({"msg": "success"})");
    });

    app.route("/api/mine", [](cinatra::Request& req, cinatra::Response& res)
    {
        boost::property_tree::ptree pt, children;

        auto body = cinatra::urlencoded_body_parser(req.body());
        std::string username = body.get_val("username");
        urlDecode(username);

        std::map<std::string,                                       /**< site */
            std::map<std::string,                                   /**< course */
                std::map<std::string,                               /**< chapter */
                    std::map<std::string, std::vector<Note>>        /**< notes */
                >
            >
        > notes;

        for(auto&& note : DataBase::getSingleton().urls)
            notes[note.second.site][note.second.course][note.second.chapter] = note.second.notes;

        for(auto&& site : notes)
        {
            for(auto&& course : site.second)
            {
                for(auto&& chapter : course.second)
                {
                    for(auto&& notes : chapter.second)
                    {
                        for(auto&& note : notes.second)
                        {
                            if(note.username == username)
                            {
                                boost::property_tree::ptree node;
                                node.put("site", site.first);
                                node.put("course", course.first);
                                node.put("chapter", chapter.first);
                                node.put("username", note.username);
                                node.put("title", note.title);
                                node.put("content", note.content);                       
                                node.put("star", note.star);                       
                                children.push_back(std::make_pair("", node));
                            }
                        }
                    }
                }
            }   
        }
        pt.put_child("data", children);
        std::stringstream ss;
        write_json(ss, pt);
        res.end(ss.str());
    });

    app.route("/api/save", [](cinatra::Request& req, cinatra::Response& res)
    {
        std::map<std::string,                                       /**< site */
            std::map<std::string,                                   /**< course */
                std::map<std::string,                               /**< chapter */
                    std::map<std::string, std::vector<Note>>        /**< notes */
                >
            >
        > notes;

        for(auto&& note : DataBase::getSingleton().urls)
            notes[note.second.site][note.second.course][note.second.chapter] = note.second.notes;

        std::ofstream html{"static/save.html"};
        html << "<html><head><meta charset='utf-8'></head><body>";
        for(auto&& site : notes)
        {
            html << "<h1>" + site.first + "</h1>";
            for(auto&& course : site.second)
            {
                html << "<h2>" + course.first + "</h2>";
                for(auto&& chapter : course.second)
                {
                    html << "<h3>" + chapter.first + "</h3>";
                    for(auto&& notes : chapter.second)
                    {
                        for(auto&& note : notes.second)
                        {
                            html << "<h4>user:" + note.username + "</h4>";
                            html << "<h4>title:" + note.title + "</h4>";
                            html << "<h4>content:" + note.content + "</h4>";
                            if(note.img != "")
                                html << "<img style='width: 100%;' src=" + note.img + "/>";
                            html << "<h4>star:" + std::to_string(note.star) + "</h4>";
                        }
                    }
                }
            }
        }
        html << "</body></html>";
        html.close();
        system("../translate"); 
        res.end(R"({"msg": "success"})");
    });

    std::ifstream pic{"../picture.base64"};
    std::stringstream ss;
    ss << pic.rdbuf();
    DataBase::getSingleton().addNote("http://www.xuetangx.com/courses/course-v1:TsinghuaX+0074"
        "0043X_2015_T2+2015_T2/courseware/a0f3bf5a4c044dfaaad6814821533699/222f0636e0e94fc19b12ccb7e7ae1323/",
        "学堂在线", "TsinghuaX:00740043X_2015_T2 C++语言程序设计基础 (2015年秋)",
        "第1章导学", "user1", "测试数据", "你好", "", "5", 1446925308836);
    DataBase::getSingleton().addNote("http://www.xuetangx.com/courses/course-v1:TsinghuaX+0074"
        "0043X_2015_T2+2015_T2/courseware/a0f3bf5a4c044dfaaad6814821533699/222f0636e0e94fc19b12ccb7e7ae1323/",
        "学堂在线", "TsinghuaX:00740043X_2015_T2 C++语言程序设计基础 (2015年秋)",
        "第2章基础语法", "user1", "问题", "三目运算符是什么?", "", "8", 1446925308836);
    DataBase::getSingleton().addNote("http://www.xuetangx.com/courses/course-v1:TsinghuaX+0074"
        "0043X_2015_T2+2015_T2/courseware/a0f3bf5a4c044dfaaad6814821533699/222f0636e0e94fc19b12ccb7e7ae1323/",
        "学堂在线", "TsinghuaX:00740043X_2015_T2 C++语言程序设计基础 (2015年秋)",
        "第3章序列点", "user1", "unsequenced evaluate", "未定义行为", ss.str(), "10", 1446925308836);
    DataBase::getSingleton().addNote("http://www.xuetangx.com/courses/course-v1:TsinghuaX+0074"
        "0043X_2015_T2+2015_T2/courseware/a0f3bf5a4c044dfaaad6814821533699/222f0636e0e94fc19b12ccb7e7ae1323/",
        "学堂在线", "TsinghuaX:00740043X_2015_T2 C++语言程序设计基础 (2015年秋)",
        "第4章语义", "user1", "SFINAE", "GP FIRST，MP SECOND", "", "12", 1446925308836);
    DataBase::getSingleton().addNote("http://www.xuetangx.com/courses/course-v1:TsinghuaX+0074"
        "0043X_2015_T2+2015_T2/courseware/a0f3bf5a4c044dfaaad6814821533699/222f0636e0e94fc19b12ccb7e7ae1323/",
        "学堂在线", "TsinghuaX:00740043X_2015_T2 C++语言程序设计基础 (2015年秋)",
        "第5章求值顺序", "user1", "DCLP", "内存屏障", "", "13", 1446925308836);
    DataBase::getSingleton().addNote("http://www.xuetangx.com/courses/course-v1:TsinghuaX+0074"
        "0043X_2015_T2+2015_T2/courseware/a0f3bf5a4c044dfaaad6814821533699/222f0636e0e94fc19b12ccb7e7ae1323/",
        "学堂在线", "TsinghuaX:00740043X_2015_T2 C++语言程序设计基础 (2015年秋)",
        "第6章xxx", "user1", "NICE", "C++ is newbie", "", "14", 1446925308836);
    DataBase::getSingleton().addNote("http://www.xuetangx.com/courses/course-v1:TsinghuaX+0074"
        "0043X_2015_T2+2015_T2/courseware/a0f3bf5a4c044dfaaad6814821533699/222f0636e0e94fc19b12ccb7e7ae1323/",
        "学堂在线", "TsinghuaX:00740043X_2015_T2 C++语言程序设计基础 (2015年秋)",
        "第7章", "user1", "GOOD FOR YOU", "Module system", "", "19", 1446925308836);
    DataBase::getSingleton().addNote("http://www.xuetangx.com/courses/course-v1:TsinghuaX+0074"
        "0043X_2015_T2+2015_T2/courseware/a0f3bf5a4c044dfaaad6814821533699/222f0636e0e94fc19b12ccb7e7ae1323/",
        "学堂在线", "TsinghuaX:00740043X_2015_T2 C++语言程序设计基础 (2015年秋)",
        "第8章", "user1", "好用的东东", "concept", "", "25", 1446925308836);
    DataBase::getSingleton().addNote("http://www.xuetangx.com/courses/course-v1:TsinghuaX+0074"
        "0043X_2015_T2+2015_T2/courseware/a0f3bf5a4c044dfaaad6814821533699/222f0636e0e94fc19b12ccb7e7ae1323/",
        "学堂在线", "TsinghuaX:00740043X_2015_T2 C++语言程序设计基础 (2015年秋)",
        "第9章", "user1", "糟糕的数组", "decay", "", "27", 1446925308836);
    
    app.static_dir("./static").listen("8080").run();    
}
