#pragma once
#include "user/User.hh"

struct Note
{
    Note(const std::string& username, const std::string& title, const std::string& cont, const std::string& img, const std::string& ct, size_t t)
        : username{username}, title{title}, content{cont}, img{img}, star{0}, current_time{ct}, time{t}
    {
        static int cur_id = 0;
        id = cur_id++;
    }

    int id;
    std::string username;
    std::string title;
    std::string content;
    std::string img;
    int star;
    std::string current_time;
    size_t time;         
};

struct Url
{
    std::string site;
    std::string course;
    std::string chapter;
    std::map<std::string, std::vector<Note>> notes;
};

class DataBase 
{
private:
    std::vector<User> users_ = { { "user1", "pass1" } };
    DataBase() = default;

public:
    std::map<std::string, Url> urls;

    static DataBase& getSingleton()
    {
        static DataBase db;
        return db;
    }

    bool checkLogin(const std::string& username, const std::string& password)
    {
        for(auto&& u : users_)
        {
            if(u.username == username && u.password == password)
                return true;
        }
        return false;
    }

    void addNote(const std::string& url, const std::string& site, const std::string& course, 
        const std::string& chapter, const std::string& username, const std::string& title, 
        const std::string& content, const std::string& img, const std::string& current_time, size_t time)
    {
        if(urls.find(url) == urls.end())
        {
            urls[url].site = site;
            urls[url].course = course;
            urls[url].chapter = chapter;
        }
        if(title == "")
        {
            if(content == "") return;
            urls[url].notes[current_time].push_back({username, content.substr(0, 10), content, img, current_time, time});
            return;
        }
        urls[url].notes[current_time].push_back({username, title, content, img, current_time, time});
    }

    std::map<std::string, std::vector<Note>>& getNotes(const std::string& url)
    {
        static std::map<std::string, std::vector<Note>> empty_vec;
        auto it = urls.find(url);
        if(it == urls.end())
            return empty_vec;
        for(auto& note_set : it->second.notes)
        { 
            std::sort(note_set.second.begin(), note_set.second.end(), [](auto l, auto r)
            {
                return l.time > r.time;
            });
        }
        return it->second.notes;
    }   
}; 
